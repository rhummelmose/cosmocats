#!/bin/bash

# Validate required variables
if [ -z $COSMOCATS_LISTENING_PORT ] || \
   [ -z $COSMOCATS_COSMOSDB_ENDPOINT ] || \
   [ -z $COSMOCATS_COSMOSDB_KEY ]; then
    echo "Required variables missing from env.."
    printf "COSMOCATS_LISTENING_PORT: %s" $COSMOCATS_LISTENING_PORT
    printf "COSMOCATS_COSMOSDB_ENDPOINT: %s" $COSMOCATS_COSMOSDB_ENDPOINT
    printf "COSMOCATS_COSMOSDB_KEY: %s" $COSMOCATS_COSMOSDB_KEY
    if [ ! -z $COSMOCATS_COSMOSDB_KEY ]; then
        echo "COSMOCATS_COSMOSDB_KEY: *****"
    else
        echo "COSMOCATS_COSMOSDB_KEY: <empty>"
    fi
    exit 1
fi

# Allow for path to be passed
path="$1"
if [ -z "$path" ]; then
    path="kubernetes"
fi

# Ensure portability
tokenize_sh_script_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Install pre-reqs (requires snap)
install_prereqs() {
    local yq_installed
    yq --version > /dev/null 2>&1
    yq_installed=$?
    if [ $yq_installed -ne 0 ]; then
        sudo snap install yq
    fi
}
install_prereqs

# Quote/escape functions for sed
quoteRe() {
    sed -e 's/[^^]/[&]/g; s/\^/\\^/g; $!a\'$'\n''\\n' <<<"$1" | tr -d '\n';
}

quoteSubst() {
  IFS= read -d '' -r < <(sed -e ':a' -e '$!{N;ba' -e '}' -e 's/[&/\]/\\&/g; s/\n/\\&/g' <<<"$1")
  printf %s "${REPLY%$'\n'}"
}

# Template SED
# sed -i '' s/$(quoteRe "$key")/$(quoteSubst "$value")/g file.ext
# Template YQ
# yq w --inplace file.ext path.to.thing "$value"

# configmaps.yml
yq w --inplace "${tokenize_sh_script_path}/../${path}/configmaps.yml" "data.cosmos-db-endpoint" "\"$COSMOCATS_COSMOSDB_ENDPOINT\""
yq w --inplace "${tokenize_sh_script_path}/../${path}/configmaps.yml" "data.listening-port" "\"$COSMOCATS_LISTENING_PORT\""

# secrets.yml
yq w --inplace "${tokenize_sh_script_path}/../${path}/secrets.yml" "data.cosmos-db-key" "\"$(printf '%s' $COSMOCATS_COSMOSDB_KEY | base64)\""

# deployments.yml
image_name=$(yq r "${tokenize_sh_script_path}/../${path}/deployments.yml" "spec.template.spec.containers[0].image")
image_tag=$BUILD_SOURCEVERSION
if [ ! -z $AZDEV_DEPLOYMENT_IMAGE_TAG ]; then
    image_tag=$AZDEV_DEPLOYMENT_IMAGE_TAG
fi
container_image="${image_name}:${image_tag}"
label_source_version="source_version"
yq w --inplace "${tokenize_sh_script_path}/../${path}/deployments.yml" "spec.template.spec.containers[0].image" "\"$container_image\""
yq w --inplace "${tokenize_sh_script_path}/../${path}/deployments.yml" "spec.template.spec.containers[0].ports[0].containerPort" "$COSMOCATS_LISTENING_PORT"
yq w --inplace "${tokenize_sh_script_path}/../${path}/deployments.yml" "metadata.labels[$label_source_version]" "\"$AZDEV_BUILD_SOURCE_VERSION\""
yq w --inplace "${tokenize_sh_script_path}/../${path}/deployments.yml" "spec.template.metadata.labels[$label_source_version]" "\"$AZDEV_BUILD_SOURCE_VERSION\""

# services.yml
yq w --inplace "${tokenize_sh_script_path}/../${path}/services.yml" "spec.ports[0].port" $COSMOCATS_LISTENING_PORT

# ingresses.yml
yq w --inplace "${tokenize_sh_script_path}/../${path}/ingresses.yml" "spec.rules[0].http.paths[0].backend.servicePort" "$COSMOCATS_LISTENING_PORT"
