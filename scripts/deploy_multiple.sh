#!/bin/bash

# Verify arguments
deployment_targets="$1"

if [ -z "$deployment_targets" ]; then
    echo "Please pass deployment targets (json array) as 1st argument.."
    exit 1
fi

# Ensure portability
echo "Ensure portability.."
deploy_multiple_sh_script_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Print argument
printf "DEPLOYMENT TARGETS:\n"
printf "%s\n" $deployment_targets

# Deploy to all targets
echo $deployment_targets | jq -r '.[] | [ ."resource-group", ."cluster-name" ] | @tsv' | 
    while IFS=$'\t' read -r resource_group cluster_name namespace; do
        echo "Deploying to cluster: (resource group: ${resource_group}, name: ${cluster_name})"
        bash "${deploy_multiple_sh_script_path}/deploy.sh" "$resource_group" "$cluster_name"
    done
