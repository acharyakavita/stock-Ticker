import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import InputBar from "../../components/Input/InputBar";
import Classes from "./ChartArea.css";
import axios from "axios";
import Moment from 'moment'
class ChartArea extends Component {
  state = {
    data: {
      labels: [],
      datasets: [
        {
          label: "Stock Price",
          fill: false,
          lineTension: 0,
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
          data: []
        }
      ]
    },
    searchInput: "",
    showResults: false,
    searchData: [
      {
        companySymbol: " ",
        companyName: " ",
        companyRegion: " "
      }
    ],
    Xlabel: ""
  };

  /*search company codes Api call*/
  searchCompanyHandler(event) {
    this.setState({ searchInput: event.target.value });
    axios
      .get(
        "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
          this.state.searchInput +
          "&apikey=4MT47F64XCP0A03M"
      )
      .then(res => {
        if (res.data.bestMatches) {
          this.storeSearchCompanyNameResults(res.data.bestMatches);
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ showResults: false });
      });
  }

  /*stores the api results for company names and symbols*/
  storeSearchCompanyNameResults(response) {
    let updatedSearchData = [
      { companySymbol: " ", companyName: " ", companyRegion: " " }
    ];

    updatedSearchData = response.splice(0, 5).map(item => ({
      companySymbol: item["1. symbol"],
      companyName: item["2. name"],
      companyRegion: item["4. region"]
    }));
    this.setState({
      searchData: [...updatedSearchData],
      showResults: true
    });
  }

  /*sets the symbol in the input bar*/
  companyCodeClickHandler = symbol => {
    this.setState({
      searchInput: symbol,
      showResults: false
    });
  };

  searchButtonClickHandler = event => {
    event.preventDefault();
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
          this.state.searchInput +
          "&outputsize=compact&apikey=4MT47F64XCP0A03M"
      )
      .then(res => {
        let daysLabel = [];
        let StringDaysLabel=[];
        let dailyClosingPrice = [];
        console.log(res)
        /*save the labels*/
        daysLabel=Object.keys(res.data["Time Series (Daily)"]).reverse().splice(95,5);
        //for(let day=0;day<daysLabel.length;day++){
        //    StringDaysLabel.push(Moment(daysLabel[day],'YYYY-MM-DD').format('MMMM DD, YYYY'))
       // }
       StringDaysLabel=daysLabel.map(date=>Moment(date,'YYYY-MM-DD').format('MMMM DD, YYYY'));

        /*save the prices*/
        for (let day in res.data["Time Series (Daily)"]) {
          dailyClosingPrice.push(
            Number(res.data["Time Series (Daily)"][day]["4. close"])
          );
        }

       let newData = { ...this.state.data };

       newData.labels = StringDaysLabel;
        newData.datasets[0].data = dailyClosingPrice.reverse().splice(95,5);
        this.setState({ data: newData, Xlabel: "Days" });
        console.log(this.state.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className={Classes.ChartArea}>
        <InputBar
          search={event => this.searchCompanyHandler(event)}
          value={this.state.searchInput}
          show={this.state.showResults}
          searchResults={this.state.searchData}
          companyCodeClick={this.companyCodeClickHandler}
          searchButtonClick={this.searchButtonClickHandler}
        />
        <Line
          data={this.state.data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              display: false
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
              xAxes: [{
                  display: true,
                  type: 'time',
                  distribution: 'linear',
                  time: {
                    unit: 'day',
                    displayFormats: {
                      day: 'MMM D'
                    },
                    ticks:{
                        source:'labels'
                    }},
                  scaleLabel: {
                    labelString: this.state.Xlabel,
                    fontSize: 20
                  }
                }
              ],
              yAxes: [{
                display: true,
                  scaleLabel: {
                    display: true,
                    labelString: "Price in USD",
                    fontSize: 10
                  }
                }
              ]
            }
          }}
        />
      </div>
    );
  }
}

export default ChartArea;
