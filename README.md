# COSMOCATS
🐈🐈🐈
## Instructions
Provision a Cosmos DB and:
```console
cat@cosmos:~$ git clone https://github.com/rhummelmose/cosmocats.git
cat@cosmos:~$ cd cosmocats
cat@cosmos:~$ docker build . -t cosmocats:latest
cat@cosmos:~$ docker run -p <YOUR LOCAL PORT>:80 -e "COSMOCATS_COSMOSDB_ENDPOINT=<YOUR ENDPOINT>" -e "COSMOCATS_COSMOSDB_KEY=<YOUR KEY>" cosmocats:latest
```
Rejoice!
## Teaser
![Screenshot](https://raw.githubusercontent.com/rhummelmose/cosmocats/master/resources/screenshot.png)
