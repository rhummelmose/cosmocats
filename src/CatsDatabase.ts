import { CosmosClient, DatabaseResponse, DatabaseAccount, Database, Container, CosmosClientOptions } from "@azure/cosmos"

import Cat from "./Cat";

export default class CatsDatabase {

    private client: CosmosClient;
    private database: Database | null;
    private container: Container | null;

    constructor(endpoint: string, key: string) {
        let cosmosClientOptions: CosmosClientOptions = {
            endpoint: endpoint,
            key: key,
            connectionPolicy: {
                enableEndpointDiscovery: false
            }
        }
        this.client = new CosmosClient(cosmosClientOptions);
        this.database = null;
        this.container = null;
    }

    async bootstrap() {
        let databaseResponse = await this.client.databases.createIfNotExists({id: "cosmocats"});
        this.database = databaseResponse.database;
        let containerResponse = await this.database.containers.createIfNotExists({id: "cosmocats"});
        this.container = containerResponse.container;
    }

    async allCats(): Promise<Cat[]> {
        let response = await this.container!.items.readAll().fetchAll();
        let cats = response.resources.map(element => {
            return new Cat(element.id!, element.url)
        })
        return cats;
    }

    async addCatWithURL(url: string): Promise<Cat> {
        let itemResponse = await this.container!.items.create({url: url})
        let item = itemResponse.item;
        console.log("Added item: %o", item);
        return new Cat(item.id, item.url)
    }

}
