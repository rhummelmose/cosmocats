export default class Configuration {
    
    static keyCosmosEndpoint = "COSMOCATS_COSMOSDB_ENDPOINT";
    static keyCosmosKey = "COSMOCATS_COSMOSDB_KEY";
    static keyListeningPort = "COSMOCATS_LISTENING_PORT";

    cosmosEndpoint: string;
    cosmosKey: string;
    listeningPort: number;

    static configurationFromEnv(): Configuration {
        let configuration = new Configuration();
        configuration.cosmosEndpoint = process.env[this.keyCosmosEndpoint];
        configuration.cosmosKey = process.env[this.keyCosmosKey];
        let listeningPortString = process.env[this.keyListeningPort];
        if (listeningPortString != null) {
            configuration.listeningPort = Number(listeningPortString)
        }
        return configuration;
    }

    constructor () {
        this.listeningPort = 80;
    }

    validate(): boolean {
        return this.cosmosEndpoint != null && this.cosmosKey != null && this.listeningPort != null;
    }
}
