import * as FileSystem from 'fs';

enum ConfigurationKey {
    type = "COSMOCATS_CONFIGURATION_TYPE",
    cosmosdbEndpoint = "COSMOCATS_COSMOSDB_ENDPOINT",
    cosmosdbAuthMechanism = "COSMOCATS_COSMOSDB_AUTH_MECHANISM",
    cosmosdbKey = "COSMOCATS_COSMOSDB_KEY",
    cosmosdbResourceId = "COSMOCATS_COSMOSDB_RESOURCE_ID",
    listeningPort = "COSMOCATS_LISTENING_PORT"
}

enum ConfigurationType {
    env = "ENV",
    fs = "FS"
}

export enum CosmosAuthMechanism {
    key = "KEY",
    managedIdentity = "MANAGED_IDENTITY"
}

export default class Configuration {
    
    cosmosEndpoint: string;
    cosmosAuthMechanism: CosmosAuthMechanism;
    cosmosKey: string;
    cosmosResourceId: string;
    listeningPort: number;

    static configuration(): Configuration {
        const configurationType = process.env[ConfigurationKey.type];
        switch (configurationType) {
            case ConfigurationType.env:
                return this.configurationFromEnv();
            case undefined:
                return this.configurationFromEnv();
            case ConfigurationType.fs:
                return this.configurationFromFileSystem();
            default:
                throw new Error("Invalid configuration type specified in env: " + configurationType);
        }
    }

    static configurationFromFileSystem(): Configuration {
        const configuration = new Configuration();
        const listeningPortConfPath = process.env[ConfigurationKey.listeningPort];
        if (listeningPortConfPath != null) {
            const listeningPortString = FileSystem.readFileSync(listeningPortConfPath, "utf8");
            configuration.listeningPort = Number(listeningPortString)
        }
        configuration.cosmosEndpoint = FileSystem.readFileSync(process.env[ConfigurationKey.cosmosdbEndpoint], "utf8");
        const cosmosAuthMechanism = FileSystem.readFileSync(process.env[ConfigurationKey.cosmosdbAuthMechanism], "utf8") as CosmosAuthMechanism;
        configuration.cosmosAuthMechanism = cosmosAuthMechanism != undefined ? cosmosAuthMechanism : CosmosAuthMechanism.key;
        configuration.cosmosKey = FileSystem.readFileSync(process.env[ConfigurationKey.cosmosdbKey], "utf8");
        configuration.cosmosResourceId = FileSystem.readFileSync(process.env[ConfigurationKey.cosmosdbResourceId], "utf8");
        return configuration;
    }

    static configurationFromEnv(): Configuration {
        let configuration = new Configuration();
        configuration.cosmosEndpoint = process.env[ConfigurationKey.cosmosdbEndpoint];
        const cosmosAuthMechanism = process.env[ConfigurationKey.cosmosdbAuthMechanism] as CosmosAuthMechanism;
        configuration.cosmosAuthMechanism = cosmosAuthMechanism != undefined ? cosmosAuthMechanism : CosmosAuthMechanism.key;
        configuration.cosmosKey = process.env[ConfigurationKey.cosmosdbKey];
        configuration.cosmosResourceId = process.env[ConfigurationKey.cosmosdbResourceId];
        let listeningPortString = process.env[ConfigurationKey.listeningPort];
        if (listeningPortString != null) {
            configuration.listeningPort = Number(listeningPortString)
        }
        return configuration;
    }

    constructor () {
        this.listeningPort = 80;
    }

    validate(): boolean {
        if (this.listeningPort == null || this.cosmosAuthMechanism == null) {
            return false
        }
        switch (this.cosmosAuthMechanism) {
            case CosmosAuthMechanism.key:
                return this.cosmosEndpoint != null && this.cosmosEndpoint.length > 0 &&
                    this.cosmosKey != null && this.cosmosKey.length > 0;
            case CosmosAuthMechanism.managedIdentity:
                return this.cosmosResourceId != null && this.cosmosResourceId.length > 0
            default:
                return false;            
        }
    }
}
