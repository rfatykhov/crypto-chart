import React from "react";
import Card from "./Card";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import ReactFC from "react-fusioncharts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import "./Chart.css";

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.BASE_URL = "https://cors.io/?https://api.cryptonator.com/api/ticker/";
    this.chartRef = null;
    this.state = {
      btcusd: "-",
      ltcusd: "-",
      ethusd: "-",
      showChart: false,
      initValue: 0,
      dataSource: {
        chart: {
          caption: "Bitcoin Chart",
          subCaption: "",
          xAxisName: "Local Time",
          yAxisName: "USD",
          numberPrefix: "$",
          refreshinterval: "2",
          slantLabels: "1",
          numdisplaysets: "10",
          labeldisplay: "rotate",
          showValues: "0",
          showRealTimeValue: "0",
          theme: "fusion"
        },
        categories: [
          {
            category: [
              {
                label: this.clientDateTime().toString()
              }
            ]
          }
        ],
        dataset: [
          {
            data: [
              {
                value: 0
              }
            ]
          }
        ]
      }
    };
    this.chartConfigs = {
      type: "realtimeline",
      renderAt: "container",
      width: "100%",
      height: "350",
      dataFormat: "json"
    };
  }

  componentDidMount() {
    this.getDataFor("btc-usd", "btcusd");
    this.getDataFor("ltc-usd", "ltcusd");
    this.getDataFor("eth-usd", "ethusd");
  }

  startUpdatingData() {
    setInterval(() => {
      fetch(this.BASE_URL + "btc-usd")
        .then(res => res.json())
        .then(d => {
          let x_axis = this.clientDateTime();
          let y_axis = d.ticker.price;
          this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
        });
    }, 2000);
  }

  getDataFor(conversion, prop) {
    fetch(this.BASE_URL + conversion, {
      mode: "cors"
    })
      .then(res => res.json())
      .then(d => {
        if (prop === "btcusd") {
          const dataSource = this.state.dataSource;
          dataSource.chart.yAxisMaxValue = parseInt(d.ticker.price) + 5;
          dataSource.chart.yAxisMinValue = parseInt(d.ticker.price) - 5;
          dataSource.dataset[0]["data"][0].value = d.ticker.price;
          this.setState(
            {
              showChart: true,
              dataSource: dataSource,
              initValue: d.ticker.price
            },
            () => {
              this.startUpdatingData();
            }
          );
        }

        this.setState({
          [prop]: d.ticker.price
        });
      });
  }

  static addLeadingZero(num) {
    return num <= 9 ? "0" + num : num;
  }

  clientDateTime() {
    var date_time = new Date();
    var curr_hour = date_time.getHours();
    var zero_added_curr_hour = Chart.addLeadingZero(curr_hour);
    var curr_min = date_time.getMinutes();
    var curr_sec = date_time.getSeconds();
    var curr_time = zero_added_curr_hour + ":" + curr_min + ":" + curr_sec;
    return curr_time;
  }

  getChartRef(chart) {
    this.chartRef = chart;
  }

  render() {
    return (
      <>
        <div>
          <div className="container">
            <div className="coins">
              <Card
                name="Bitcoin (BTC)"
                src={"BTC.png"}
                alt="Bitcoin"
                value={this.state.btcusd}
                className="item"
              />
              <Card
                name="Litecoin (LTC)"
                src={"LTC.png"}
                alt="Litecoin"
                value={this.state.ltcusd}
                className="item"
              />
              <Card
                name="Ethereum (ETH)"
                src={"ETH.png"}
                alt="Ethereum"
                value={this.state.ethusd}
                className="item"
              />
            </div>
          </div>
          <div>
            <div>
              <div>
                {this.state.showChart ? (
                  <ReactFC
                    {...this.chartConfigs}
                    dataSource={this.state.dataSource}
                    onRender={this.getChartRef.bind(this)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Chart;
