import React, { Component } from "react";

import 'styles/App.css';
import 'styles/tailwind.css';
import "tailwindcss/dist/base.css";


import Agolia from "components/algolia/algoliaInstantSearch";
import MiniCenteredFooter from "components/footers/MiniCenteredFooter";
import TwoColumnWithInput from "components/hero/TwoColumnWithInput";








class App extends Component {
  state = {}
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



