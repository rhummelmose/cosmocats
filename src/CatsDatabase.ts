import { CosmosClient, DatabaseResponse, DatabaseAccount, Database, Container, CosmosClientOptions } from "@azure/cosmos";

import Cat from "./Cat";

export default class CatsDatabase {

    private client: CosmosClient;
    private database: Database | null;
    private container: Container | null;

    constructor(connectionString: string)
    constructor(endpoint: string, key: string)
    constructor(connectionStringOrEndpoint?: string, key?: string) {
        if (key == null) {
            this.client = new CosmosClient(connectionStringOrEndpoint);
        } else {
            this.client = new CosmosClient({ endpoint: connectionStringOrEndpoint, key: key });
        }
        this.database = null;
        this.container = null;
    }

    async bootstrap() {
        try {
            let databaseResponse = await this.client.databases.createIfNotExists({id: "cosmocats"});
            this.database = databaseResponse.database;
            let containerResponse = await this.database.containers.createIfNotExists({id: "cosmocats"});
            this.container = containerResponse.container;
        } catch (e) {
            console.log(e);
        }
        
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
