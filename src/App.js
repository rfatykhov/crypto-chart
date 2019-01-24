import React, { Component } from "react";
import Navbar from "./components/Navbar";
import Chart from "./components/Chart";

class App extends Component {
  render() {
    return (
      <>
        <Navbar />
        <Chart />
      </>
    );
  }
}

export default App;
