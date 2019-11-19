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
## Configuration
Set environment variable **COSMOCATS_CONFIGURATION_TYPE** to **ENV** (default) or **FS** to specify how the app should retrieve its configuration at runtime. If configuration type **ENV** is chosen, the following environment variables have to contain the actual values while in the case of **FS** they have to contain absolute paths to files that contain the actual values.

Available configuration variables:
* COSMOCATS_LISTENING_PORT
  * Defaults to 80
  * The port on which the application should listen
* COSMOCATS_COSMOSDB_ENDPOINT
  * The Cosmos DB endpoint to which the application should connect
* COSMOCATS_COSMOSDB_KEY
  * Key used to authenticate with the Cosmos DB at the specified endpoint

## Teaser
![Screenshot](https://raw.githubusercontent.com/rhummelmose/cosmocats/master/resources/screenshot.png)
