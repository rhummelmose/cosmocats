import * as FileSystem from 'fs';

export default class Configuration {
    
    static keyConfigurationType = "COSMOCATS_CONFIGURATION_TYPE";
    static keyCosmosEndpoint = "COSMOCATS_COSMOSDB_ENDPOINT";
    static keyCosmosKey = "COSMOCATS_COSMOSDB_KEY";
    static keyListeningPort = "COSMOCATS_LISTENING_PORT";

    static valueConfigurationTypeFileSystem = "FS";
    static valueConfigurationTypeEnv = "ENV";

    cosmosEndpoint: string;
    cosmosKey: string;
    listeningPort: number;

    static configuration(): Configuration {
        const configurationType = process.env[this.keyConfigurationType];
        switch (configurationType) {
            case this.valueConfigurationTypeEnv || null:
                return this.configurationFromEnv();
            case this.valueConfigurationTypeFileSystem:
                return this.configurationFromFileSystem();
            default:
                throw new Error("Invalid configuration type specified in env: " + configurationType);
        }
    }

    static configurationFromFileSystem(): Configuration {
        const configuration = new Configuration();
        const listeningPortString = FileSystem.readFileSync(this.keyListeningPort, "utf8");
        if (listeningPortString != null && listeningPortString.length > 0) {
            configuration.listeningPort = Number(listeningPortString)
        }
        configuration.cosmosEndpoint = FileSystem.readFileSync(this.keyCosmosEndpoint, "utf8");
        configuration.cosmosKey = FileSystem.readFileSync(this.keyCosmosKey, "utf8");
        return configuration;
    }

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
        return this.cosmosEndpoint != null &&
            this.cosmosEndpoint.length > 0 &&
            this.cosmosKey != null &&
            this.cosmosKey.length > 0 &&
            this.listeningPort != null;
    }
}
