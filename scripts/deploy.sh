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

# Authenticate with the cluster 
az aks get-credentials --resource-group $resource_group --name $cluster_name --admin

# Change namespace
kubectl config set-context --current --namespace=$namespace

# Deploy
kubectl apply -f kubernetes/configmaps.yml
kubectl apply -f kubernetes/secrets.yml
kubectl apply -f kubernetes/deployments.yml
kubectl apply -f kubernetes/services.yml
kubectl apply -f kubernetes/ingresses.yml
