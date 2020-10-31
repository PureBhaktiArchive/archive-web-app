import Agolia from 'components/algolia/algoliaInstantSearch.js';
import MiniCenteredFooter from 'components/footers/MiniCenteredFooter';
import TwoColumnWithInput from 'components/hero/TwoColumnWithInput';
import 'instantsearch.css/themes/algolia.css';
import React, { Component } from 'react';
import 'styles/App.css';
import 'styles/tailwind.css';
import 'tailwindcss/dist/base.css';

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <TwoColumnWithInput />
        <Agolia />
        <MiniCenteredFooter />
      </React.Fragment>
    );
  }
}

export default App;
