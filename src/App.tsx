import React from 'react';
import { Stack, Text, Button } from 'office-ui-fabric-react';
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

    render() {
        return (
            <div style={{width:"100%", height:"100%"}}>
                <Stack
                    horizontalAlign="center"
                    styles={{
                        root: {
                            margin: '0 auto',
                            textAlign: 'center',
                            color: '#605e5c'
                        }
                    }}
                    gap={15}
                >
                    <div style={{width:"100%", height:"150px", backgroundColor:"#003350"}}>
                        <Text variant="mega" styles={{root: {textTransform:"uppercase", lineHeight:"135px", color:"#FFF"}}}>Cosmocats</Text>
                    </div>
                    <div style={{width:"100%", height:"80px", margin:"0"}}>
                        <Text variant="xLarge" styles={{root: {textTransform: "uppercase", lineHeight: "80px"}}}># of cats: {this.state.cats.length}</Text>
                    </div>
                </Stack>
                <Stack
                    horizontalAlign="center"
                    styles={{
                        root: {
                            margin: '0 auto',
                            textAlign: 'center',
                            color: '#605e5c',
                            width: "100%",
                            position: "fixed",
                            bottom: "0",
                            height: "calc(100% - 150px - 80px);"
                        }
                    }}
                    gap={15}
                    reversed
                >
                    <Button onClick={this._alertClicked.bind(this)}
                        style={{margin: "0", width: "100%", backgroundColor: "#007b26", border: "0", padding: "40px", fontSize: "25px", color: "#FFF", textTransform: "uppercase"}}>
                            Add cat!
                    </Button>
                    <Stack horizontal styles={{
                        root: {
                            overflowX: "scroll",
                            overflowY: "hidden",
                            width: "100%",
                            backgroundColor: "black",
                            height: "calc(100% - 80px)"
                        }
                    }}>
                        {this.state.cats.length != 0 ? this.state.cats : <Text style={{fontSize: "30px", color: "#FFF", width:"100%", position: "relative", top: "calc(50% - 15px)"}}>No cats :(</Text>}
                    </Stack>
                </Stack>
            </div>
        );
    }
}
