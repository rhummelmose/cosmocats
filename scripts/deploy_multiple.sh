#!/bin/bash

deployment_targets="$1"

# Print argument
printf "DEPLOYMENT TARGETS:\n"
printf "%s\n" $deployment_targets

# jq print deployment targets
printf "%s" $deployment_targets | jq .

# Print each deployment target
deployment_targets_tsv=$(printf "%s" $deployment_targets | jq -r '.[] | [.resource-group, .cluster-name, .namespace] | @tsv')
printf "%s" $deployment_targets_tsv | while IFS=$'\t' read -r resource_group cluster_name namespace; do
    echo "$resource_group"
    echo "$cluster_name"
    echo "$namespace"
done
