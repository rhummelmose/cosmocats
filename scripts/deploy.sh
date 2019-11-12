#!/bin/bash

# Get arguments
resource_group=$1
cluster_name=$2
namespace=$3

# Verify arguments
if [ -z "$resource_group" ]; then
    echo "Resource group name required as 1st argument.."
    exit 1
fi
if [ -z "$cluster_name" ]; then
    echo "Cluster name required as 2nd argument.."
    exit 1
fi
if [ -z "$namespace" ]; then
    echo "Namespace required as 3rd argument.."
    exit 1
fi

# Ensure portability
echo "Ensure portability.."
deploy_sh_script_path="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Authenticate with the cluster 
az aks get-credentials --resource-group $resource_group --name $cluster_name --admin

# Change namespace
kubectl config set-context --current --namespace=$namespace

# Deploy
kubectl apply -f "${deploy_sh_script_path}/../kubernetes/configmaps.yml"
kubectl apply -f "${deploy_sh_script_path}/../kubernetes/secrets.yml"
kubectl apply -f "${deploy_sh_script_path}/../kubernetes/deployments.yml"
kubectl apply -f "${deploy_sh_script_path}/../kubernetes/services.yml"
kubectl apply -f "${deploy_sh_script_path}/../kubernetes/ingresses.yml"
