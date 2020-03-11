import * as Express from "express";
import * as Path from "path";

import Configuration from "./Configuration";
import { CosmosAuthMechanism } from "./Configuration";
import CosmosManagedIdentity from "./CosmosManagedIdentity"
import CatsDatabase from "./CatsDatabase";
import Cat from "./Cat";

export default class App {

    private expressApp = Express();
    private configuration: Configuration;
    private catsDatabase: CatsDatabase;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
        this.expressApp.get("/cats", this.getCats.bind(this));
        this.expressApp.post("/cats", this.postCats.bind(this));
        this.expressApp.use("/", Express.static(Path.join(__dirname, "./public")));
        this.expressApp.get("*", this.getAny);
    }

    async start() {
        switch
         (this.configuration.cosmosAuthMechanism) {
            case CosmosAuthMechanism.key:
                this.catsDatabase = new CatsDatabase(this.configuration.cosmosEndpoint, this.configuration.cosmosKey);
                break;
            case CosmosAuthMechanism.managedIdentity:
                let connectionString = await CosmosManagedIdentity.connectionStringForResourceId(this.configuration.cosmosResourceId);
                console.log("Connection string: " + connectionString)
                this.catsDatabase = new CatsDatabase(connectionString);
                break;
        }
        await this.catsDatabase.bootstrap();
        this.expressApp.listen(this.configuration.listeningPort);
    }

    async getCats(_: Express.Request, response: Express.Response) {
        const cats = await this.catsDatabase.allCats();
        response.json(cats);
        response.end();
    }

    async postCats(_: Express.Request, response: Express.Response) {
        const catURL = Cat.randomCatPictureURL();
        const cat = await this.catsDatabase.addCatWithURL(catURL);
        response.json(cat);
        response.end();
    }

    getAny(_: Express.Request, response: Express.Response) {
        response.sendFile("public/index.html", { root: Path.join(__dirname, './') });
    }
}
