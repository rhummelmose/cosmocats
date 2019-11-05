import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { mergeStyles } from 'office-ui-fabric-react';
import * as dotenv from "dotenv";

declare global {
  interface Window { _env_: { COSMOCATS_COSMOSDB_ENDPOINT: string, COSMOCATS_COSMOSDB_KEY: string }; }
}

console.log("Process env: %o", process.env);
console.log("Window env: %o", window._env_);

// Inject some global styles
mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#app)': {
      margin: 0,
      padding: 0,
      height: '100vh'
    }
  }
});


ReactDOM.render(<App />, document.getElementById('app'));
