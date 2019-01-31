import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import InputBar from "../../components/Input/InputBar";
import Classes from "./ChartArea.css";
import axios from "axios";
import Moment from "moment";
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
    Xlabel: "",
    unit:''
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

  pad(number) {
    return (number < 10 ? "0" : "") + number;
  }

  /*Current day ApI*/
  todayButtonClickHandler = () => {
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
          this.state.searchInput +
          "&interval=5min&outputsize=compact&apikey=4MT47F64XCP0A03M"
      )
      .then(res => {
        let timeIntervalLabel = [];
        let stringTimeIntervalLabel = [];
        let closingPrice = [];
        /*getting current date in YYYY-MM-DD format*/
        let currentDate = `${new Date().getFullYear()}-${this.pad(
          new Date().getMonth() + 1
        )}-${this.pad(new Date().getDate())}`;

        for (let dateObj in res.data["Time Series (5min)"]) {
          if (dateObj.startsWith(currentDate)) {
            timeIntervalLabel.push(dateObj);
            closingPrice.push(
              Number(res.data["Time Series (5min)"][dateObj]["4. close"])
            );
          }
        }

        stringTimeIntervalLabel = timeIntervalLabel.map(date =>
          Moment(date,'YYYY-MM-DD hh:mm:ss').format()
        );

        let newData = { ...this.state.data };
        newData.labels = stringTimeIntervalLabel.reverse();
        newData.datasets[0].data = closingPrice.reverse();
        this.setState({ data: newData, Xlabel: "Time",unit:'hour' });
      })
      .catch(err => {
        console.log(err);
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
        let StringDaysLabel = [];
        let dailyClosingPrice = [];

        /*save the labels*/
        daysLabel = Object.keys(
          res.data["Time Series (Daily)"]
        ).reverse(); /*.splice(95,5);*/
        StringDaysLabel = daysLabel.map(date =>
          Moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
        );

        /*save the prices*/
        for (let day in res.data["Time Series (Daily)"]) {
          dailyClosingPrice.push(
            Number(res.data["Time Series (Daily)"][day]["4. close"])
          );
        }

        let newData = { ...this.state.data };
        newData.labels = StringDaysLabel;
        newData.datasets[0].data = dailyClosingPrice.reverse(); /*.splice(95,5);*/
        this.setState({ data: newData, Xlabel: "Days",unit:'day' });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            type: "time",
            distribution: "linear",
            time: {
              unit: this.state.unit,
              ticks: {
                source: "labels"
              }
            },
            scaleLabel: {
              labelString: this.state.Xlabel,
              fontSize: 20
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Price in USD",
              fontSize: 10
            },
            ticks: {
              beginAtZero: true,
            }
          }
        ]
      }
    };
    return (
      <div className={Classes.ChartArea}>
        <InputBar
          search={event => this.searchCompanyHandler(event)}
          value={this.state.searchInput}
          show={this.state.showResults}
          searchResults={this.state.searchData}
          companyCodeClick={this.companyCodeClickHandler}
          todayButtonClick={this.todayButtonClickHandler}
          searchButtonClick={this.searchButtonClickHandler}
          weeklyButtonClick={this.weeklyButtonClickHandler}
        />
        <Line data={this.state.data} options={options} />
      </div>
    );
  }
}

export default ChartArea;
