import React from "react";
import { Stack, Text, Button } from "office-ui-fabric-react";
import CatsDatabase from "./CatsDatabase";

export class App extends React.Component<{}, { cats: JSX.Element[] }> {

    private readonly databaseEndpoint = process.env["COSMOCATS_COSMOSDB_ENDPOINT"] != undefined ? process.env["COSMOCATS_COSMOSDB_ENDPOINT"] : window._env_.COSMOCATS_COSMOSDB_ENDPOINT;
    private readonly databaseKey = process.env["COSMOCATS_COSMOSDB_KEY"] != undefined ? process.env["COSMOCATS_COSMOSDB_KEY"] : window._env_.COSMOCATS_COSMOSDB_KEY;

    catsDatabase: CatsDatabase | null = null;
    cats: JSX.Element[] = [];

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = { cats: [] }
    }

    async componentDidMount() {
        this.catsDatabase = new CatsDatabase(this.databaseEndpoint!, this.databaseKey!);
        await this.catsDatabase.bootstrap();
        this.refreshCatImages();
    }

    async refreshCatImages() {
        const allCats = await this.catsDatabase!.allCats();
        const allCatImages = allCats.map(cat => {
            return <img key={cat.id} src={cat.url} />
        });
        this.setState({cats: allCatImages});
    }

    async _alertClicked() {
        console.log("I was clicked");
        await this.catsDatabase!.addCat();
        this.refreshCatImages();
    }

    private outerDivStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
    };

    private topStackStyles = {
        root: {
            margin: "0 auto",
            textAlign: "center",
            color: "#605e5c"
        }
    };

    private headerDivStyle: React.CSSProperties = {
        width:"100%",
        height:"150px",
        backgroundColor:"#003350",
    };

    private headerTextStyles = {
        root: {
            textTransform:"uppercase",
            lineHeight:"135px",
            color:"#FFF",
        }
    };

    private countDivStyle: React.CSSProperties = {
        width:"100%",
        height:"80px",
        margin:"0",
    };

    private countTextStyles = {
        root: {
            textTransform: "uppercase",
            lineHeight: "80px"
        }
    };

    private bottomStackStyle = {
        root: {
            margin: "0 auto",
            textAlign: "center",
            color: "#605e5c",
            width: "100%",
            position: "fixed" as "fixed",
            bottom: "0",
            height: "calc(100% - 150px - 80px);",
        }
    };

    private addCatButtonStyle: React.CSSProperties = {
        margin: "0",
        width: "100%",
        backgroundColor: "#007b26",
        border: "0",
        padding: "40px",
        fontSize: "25px",
        color: "#FFF",
        textTransform: "uppercase",
    };

    private catsHorizontalStackStyles = {
        root: {
            overflowX: "scroll" as "scroll",
            overflowY: "hidden" as "hidden",
            width: "100%",
            backgroundColor: "black",
            height: "calc(100% - 80px)",
        }
    };

    private noCatsTextStyle: React.CSSProperties = {
        fontSize: "30px",
        color: "#FFF",
        width:"100%",
        position: "relative",
        top: "calc(50% - 15px)",
    };

    render() {
        return (
            <div style={this.outerDivStyle}>
                <Stack horizontalAlign="center" styles={this.topStackStyles} gap={15}>
                    <div style={this.headerDivStyle}>
                        <Text variant="mega" styles={this.headerTextStyles}>Cosmocats</Text>
                    </div>
                    <div style={this.countDivStyle}>
                        <Text variant="xLarge" styles={this.countTextStyles}># of cats: {this.state.cats.length}</Text>
                    </div>
                </Stack>
                <Stack horizontalAlign="center" styles={this.bottomStackStyle} gap={15} reversed>
                    <Button onClick={this._alertClicked.bind(this)} style={this.addCatButtonStyle}>Add cat!</Button>
                    <Stack horizontal styles={this.catsHorizontalStackStyles}>
                        {this.state.cats.length != 0 ? this.state.cats : <Text style={this.noCatsTextStyle}>No cats :(</Text>}
                    </Stack>
                </Stack>
            </div>
        );
    }
}
