#!/bin/bash

# Authenticate with the cluster 
az aks get-credentials --resource-group $COSMOCATS_RESOURCE_GROUP --name $COSMOCATS_CLUSTER_NAME --admin

# Kubectl
kubectl apply -f kubernetes/configmaps.yml
kubectl apply -f kubernetes/secrets.yml
kubectl apply -f kubernetes/deployments.yml
kubectl apply -f kubernetes/services.yml
kubectl apply -f kubernetes/ingresses.yml
