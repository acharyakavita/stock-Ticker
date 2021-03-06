import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import InputBar from "../../components/Input/InputBar";
import Classes from "./ChartArea.css";
import axios from "axios";
import Moment from "moment";
import StockBar from "../../components/StockBar/StockBar";
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
    unit: "",
    beginAtZero: true,
    quote: {
      open: 0,
      high: 0,
      low: 0,
      price: 0,
      volume: 0,
      close: 0
    },
    disable:true,
    error: false,
    errorMsg: "",
    delay:
      "Internal Error.Please try again after 1 minute",
    delayFlag: false
  };
  /*search company codes Api call*/
  searchCompanyHandler(event) {    
      this.setState({ searchInput: event.target.value }, () => {
        axios
          .get(
            "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
              this.state.searchInput +
              "&apikey=ZZZ80OGXCD88Y1IQ"
          )
          .then(res => {
            if (res.data.bestMatches) {
              this.storeSearchCompanyNameResults(res.data.bestMatches);
            } else {
              this.setState({ delayFlag: true });
            }
          })
          .catch(err => {
            this.setState({ showResults: false, error: true });
          });
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
      showResults: true,
      beginAtZero: true,
      delayFlag: false,
      disable:true
    });
  }

  /*sets the symbol in the input bar*/
  companyCodeClickHandler = symbol => {
    this.setState({
      searchInput: symbol,
      showResults: false,
      beginAtZero: true
    });
  };

  pad(number) {
    return (number < 10 ? "0" : "") + number;
  }

  searchButtonClickHandler = event => {
    event.preventDefault();
    axios
      .get(
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
          this.state.searchInput +
          "&apikey=KIJ6KJC10DZER3UN"
      )
      .then(res => {
        if (res.data["Global Quote"]) {
          let newQuote = { ...this.state.quote };
          newQuote.open = res.data["Global Quote"]["02. open"];
          newQuote.high = res.data["Global Quote"]["03. high"];
          newQuote.low = res.data["Global Quote"]["04. low"];
          newQuote.volume = res.data["Global Quote"]["06. volume"];
          newQuote.close = res.data["Global Quote"]["08. previous close"];
          newQuote.price = res.data["Global Quote"]["05. price"];
          this.setState({ quote: newQuote, delayFlag: false,disable:false});
          this.todaysData();
        } else {
          this.setState({ delayFlag: true });
        }
      })
      .catch(err => {
        this.setState({ error: true, errorMsg: err.toString() });
      });
  };
  /*Current day ApI*/
  todaysData() {
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
          this.state.searchInput +
          "&interval=5min&outputsize=compact&apikey=JPISGAS476P6HG9C"
      )
      .then(res => {
        if (res.data["Time Series (5min)"]) {
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
            Moment(date, "YYYY-MM-DD hh:mm:ss").format()
          );

          let newData = { ...this.state.data };
          newData.labels = stringTimeIntervalLabel.reverse();
          newData.datasets[0].data = closingPrice.reverse();
          this.setState({
            data: newData,
            Xlabel: "Time",
            unit: "hour",
            beginAtZero: false,
            delayFlag: false
          });
        } else {
          this.setState({ delayFlag: true });
        }
      })
      .catch(err => {
        this.setState({ error: true, errorMsg: err.toString() });
      });
  }

  dailyButtonClickHandler = () => {
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
          this.state.searchInput +
          "&outputsize=compact&apikey=4MT47F64XCP0A03M"
      )
      .then(res => {
        if (res.data["Time Series (Daily)"]) {
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
          this.setState({
            data: newData,
            Xlabel: "Days",
            unit: "day",
            beginAtZero: false,
            delayFlag: false
          });
        } else {
          this.setState({ delayFlag: true });
        }
      })
      .catch(err => {
        this.setState({ error: true, errorMsg: err.toString() });
      });
  };

  /*monthly data*/
  monthlyButtonClickHandler = () => {
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" +
          this.state.searchInput +
          "&apikey=W1NH4P7WJHXOS5WT"
      )
      .then(res => {
        if (res.data["Monthly Time Series"]) {
          let monthlyLabel = [];
          let stringMonthlyLabel = [];
          let monthlyClosingPrice = [];

          /*save the labels*/
          monthlyLabel = Object.keys(res.data["Monthly Time Series"]).reverse();
          stringMonthlyLabel = monthlyLabel.map(date =>
            Moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
          );

          /*save the prices*/
          for (let month in res.data["Monthly Time Series"]) {
            monthlyClosingPrice.push(
              Number(res.data["Monthly Time Series"][month]["4. close"])
            );
          }

          let newData = { ...this.state.data };
          newData.labels = stringMonthlyLabel;
          newData.datasets[0].data = monthlyClosingPrice.reverse();
          this.setState({
            data: newData,
            Xlabel: "Month Ending",
            unit: "year",
            beginAtZero: false,
            delayFlag: false
          });
        } else {
          this.setState({ delayFlag: true });
        }
      })

      .catch(err => {
        this.setState({ error: true, errorMsg: err.toString() });
      });
  };

  /*weekly data*/
  weeklyButtonClickHandler = event => {
    axios
      .get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
          this.state.searchInput +
          "&apikey=4MT47F64XCP0A03M"
      )
      .then(res => {
        if (res.data["Weekly Time Series"]) {
          let weeklyLabel = [];
          let stringWeeklyLabel = [];
          let weeklyClosingPrice = [];

          /*save the labels*/
          weeklyLabel = Object.keys(
            res.data["Weekly Time Series"]
          ).reverse(); /*.splice(95,5);*/
          stringWeeklyLabel = weeklyLabel.map(date =>
            Moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
          );

          /*save the prices*/
          for (let week in res.data["Weekly Time Series"]) {
            weeklyClosingPrice.push(
              Number(res.data["Weekly Time Series"][week]["4. close"])
            );
          }

          let newData = { ...this.state.data };
          newData.labels = stringWeeklyLabel;
          newData.datasets[0].data = weeklyClosingPrice.reverse(); /*.splice(95,5);*/
          this.setState({
            data: newData,
            Xlabel: "Week Ending",
            unit: "month",
            beginAtZero: false,
            delayFlag: false
          });
        } else {
          this.setState({ delayFlag: true });
        }
      })
      .catch(err => {
        this.setState({ error: true, errorMsg: err.toString() });
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
              beginAtZero: this.state.beginAtZero
            }
          }
        ]
      }
    };

    let data = null;
    if (this.state.delayFlag) {
      data = <p className={Classes.Error}>{this.state.delay}</p>;
    }
    if (this.state.error) {
      data = <p className={Classes.Error}>{this.state.errorMsg}</p>;
    }
    return (
      <div className={Classes.ChartArea}>
        <InputBar
          search={event => this.searchCompanyHandler(event)}
          value={this.state.searchInput}
          show={this.state.showResults}
          searchResults={this.state.searchData}
          companyCodeClick={this.companyCodeClickHandler}
          searchButtonClick={this.searchButtonClickHandler}
          dailyButtonClick={this.dailyButtonClickHandler}
          weeklyButtonClick={this.weeklyButtonClickHandler}
          monthlyButtonClick={this.monthlyButtonClickHandler}
          disable={this.state.disable}
        />
        {data}
        <StockBar quoteData={this.state.quote} />
        <Line data={this.state.data} options={options} />
      </div>
    );
  }
}

export default ChartArea;
