import * as FileSystem from 'fs';

enum ConfigurationKey {
    type = "COSMOCATS_CONFIGURATION_TYPE",
    cosmosdbEndpoint = "COSMOCATS_COSMOSDB_ENDPOINT",
    cosmosdbKey = "COSMOCATS_COSMOSDB_KEY",
    listeningPort = "COSMOCATS_LISTENING_PORT"
}

enum ConfigurationType {
    env = "ENV",
    fs = "FS"
}

export default class Configuration {
    
    cosmosEndpoint: string;
    cosmosKey: string;
    listeningPort: number;

    static configuration(): Configuration {
        const configurationType = process.env[ConfigurationKey.type];
        switch (configurationType) {
            case ConfigurationType.env || null:
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
        configuration.cosmosKey = FileSystem.readFileSync(process.env[ConfigurationKey.cosmosdbKey], "utf8");
        return configuration;
    }

    static configurationFromEnv(): Configuration {
        let configuration = new Configuration();
        configuration.cosmosEndpoint = process.env[ConfigurationKey.cosmosdbEndpoint];
        configuration.cosmosKey = process.env[ConfigurationKey.cosmosdbKey];
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
        return this.cosmosEndpoint != null &&
            this.cosmosEndpoint.length > 0 &&
            this.cosmosKey != null &&
            this.cosmosKey.length > 0 &&
            this.listeningPort != null;
    }
}
