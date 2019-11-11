import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { mergeStyles } from 'office-ui-fabric-react';

import App from './App.react';

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
