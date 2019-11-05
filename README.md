# COSMOCATS
🐈🐈🐈
## Instructions
1. Provision a Cosmos DB and set its CORS setting to "*"
1. > git clone https://github.com/rhummelmose/cosmocats.git
1. > cd cosmocats
1. > docker build . -t cosmocats:latest
1. > docker run -p <YOUR LOCAL PORT>:80 -e "COSMOCATS_COSMOSDB_ENDPOINT=<YOUR ENDPOINT>" -e "COSMOCATS_COSMOSDB_KEY=<YOUR KEY>"
1. Rejoice!
