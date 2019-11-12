#!/bin/bash

deployment_targets="$1"

# Print argument
printf "DEPLOYMENT TARGETS:\n"
printf "%s\n" $deployment_targets

# Get deployment targets
printf "%s" $deployment_targets | jq .
