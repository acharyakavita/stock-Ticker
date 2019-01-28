import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import InputBar from "../../components/Input/InputBar";
import Classes from "./ChartArea.css";
import axios from "axios";

class ChartArea extends Component {
  state = {
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    },
    searchInput: "",
    showResults: false,
    companySymbol: [],
    companyName: []
  };

  searchCompanyHandler(event) {
    this.setState({ searchInput: event.target.value });
    axios
      .get(
        "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
          this.state.searchInput +
          "&apikey=4MT47F64XCP0A03M"
      )
      .then(res => {
        this.storeSearchCompanyNameResults(res.data.bestMatches);
      })
      .catch(err => {
        console.log(err);
        this.setState({ showResults: false });
      });
  }

  /*stores the api results for company names and symbols*/
  storeSearchCompanyNameResults(response) {
    let newCompanySymbols = [];
    let newCompanyNames = [];
    for (let item = 0; item < 4; item++) {
      newCompanySymbols[item] = response[item]["1. symbol"];
      newCompanyNames[item] = response[item]["2. name"];
    }
    this.setState({
      companyName: newCompanyNames,
      companySymbol: newCompanySymbols,
      showResults: true
    });
  }

  render() {
    return (
      <div className={Classes.ChartArea}>
        <InputBar
          search={event => this.searchCompanyHandler(event)}
          value={this.state.symbol}
          show={this.state.showResults}
          companyName={this.state.companyName}
          companySymbol={this.state.companySymbol}
        />
        <Line
          data={this.state.data}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }
}

export default ChartArea;
