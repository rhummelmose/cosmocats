#!/bin/bash

touch .env
echo "COSMOCATS_COSMOSDB_ENDPOINT=\"$COSMOCATS_COSMOSDB_ENDPOINT\"" >> .env
echo "COSMOCATS_COSMOSDB_KEY=\"$COSMOCATS_COSMOSDB_KEY\"" >> .env
