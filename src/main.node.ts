import Configuration from "./Configuration";
import App from "./App.node";

const configuration = Configuration.configuration();
if (!configuration.validate()) {
    throw new Error("Configuration has to be set in environment.");
}

const app = new App(configuration);

app.start();
