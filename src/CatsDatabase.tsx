import { CosmosClient, DatabaseResponse, DatabaseAccount, Database, Container, CosmosClientOptions } from "@azure/cosmos"

import { HttpStatusCode, HttpStatusCodeGetRandom } from "./HttpStatusCode";
import Cat from "./Cat";

class CatsDatabase {

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

    async addCat() {
        let catURL = this.getCatURL();
        let itemResponse = await this.container!.items.create({url: catURL})
        let item = itemResponse.item;
        console.log("Added item: %o", item);
    }

    private getCatURL (): string {
        const myRandomValue = HttpStatusCodeGetRandom();
        let catURL = "https://http.cat/" + myRandomValue + ".jpg";
        return catURL;
    }

}

export default CatsDatabase;
