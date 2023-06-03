import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../shared/services/security.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { DashboardService } from './dasboard.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public dailyTask: { pendingOrders: number, unpaidOrders: number, shortOfStockProducts: number };
  //
  public config;
  constructor(
    private service:DashboardService,
    private securityService:SecurityService,
    private configurationService:ConfigurationService
  ) {}

  ngOnInit() {
    if(this.configurationService.isReady){
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.loadData();
      })
    }

    // this.canvas = document.getElementById("chartLineRed");
    // this.ctx = this.canvas.getContext("2d");

    // var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    // gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    // gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    // gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    // var data = {
    //   labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    //   datasets: [{
    //     label: "Data",
    //     fill: true,
    //     backgroundColor: gradientStroke,
    //     borderColor: '#ec250d',
    //     borderWidth: 2,
    //     borderDash: [],
    //     borderDashOffset: 0.0,
    //     pointBackgroundColor: '#ec250d',
    //     pointBorderColor: 'rgba(255,255,255,0)',
    //     pointHoverBackgroundColor: '#ec250d',
    //     pointBorderWidth: 20,
    //     pointHoverRadius: 4,
    //     pointHoverBorderWidth: 15,
    //     pointRadius: 4,
    //     data: [80, 100, 70, 80, 120, 80],
    //   }]
    // };

    // var myChart = new Chart(this.ctx, {
    //   type: 'line',
    //   data: data,
    //   options: gradientChartOptionsConfigurationWithTooltipRed
    // });


    // this.canvas = document.getElementById("chartLineGreen");
    // this.ctx = this.canvas.getContext("2d");


    // var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    // gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    // gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    // gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    // var data = {
    //   labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
    //   datasets: [{
    //     label: "My First dataset",
    //     fill: true,
    //     backgroundColor: gradientStroke,
    //     borderColor: '#00d6b4',
    //     borderWidth: 2,
    //     borderDash: [],
    //     borderDashOffset: 0.0,
    //     pointBackgroundColor: '#00d6b4',
    //     pointBorderColor: 'rgba(255,255,255,0)',
    //     pointHoverBackgroundColor: '#00d6b4',
    //     pointBorderWidth: 20,
    //     pointHoverRadius: 4,
    //     pointHoverBorderWidth: 15,
    //     pointRadius: 4,
    //     data: [90, 27, 60, 12, 80],
    //   }]
    // };

    // var myChart = new Chart(this.ctx, {
    //   type: 'line',
    //   data: data,
    //   options: gradientChartOptionsConfigurationWithTooltipGreen

    // });

    // this.canvas = document.getElementById("CountryChart");
    // this.ctx  = this.canvas.getContext("2d");
    // var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    // gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    // gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    // gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


    // var myChart = new Chart(this.ctx, {
    //   type: 'bar',
    //   responsive: true,
    //   legend: {
    //     display: false
    //   },
    //   data: {
    //     labels: ['USA', 'GER', 'AUS', 'UK', 'RO', 'BR'],
    //     datasets: [{
    //       label: "Countries",
    //       fill: true,
    //       backgroundColor: gradientStroke,
    //       hoverBackgroundColor: gradientStroke,
    //       borderColor: '#1f8ef1',
    //       borderWidth: 2,
    //       borderDash: [],
    //       borderDashOffset: 0.0,
    //       data: [53, 20, 10, 80, 100, 45],
    //     }]
    //   },
    //   options: gradientBarChartConfiguration
    // });

  }

  loadData(){
    this.loadRevenueChart();
    this.loadDailyTask();
  }

  loadDailyTask() {
    this.service.getDailyTask().subscribe({
      next: dailyTask => this.dailyTask = dailyTask
    })
  }

  public loadRevenueChart() {
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var chartLabels = [];
    let dates: Date[] = [];
    for (let i = 0; i < 5; ++i) {
      let yesterday: Date = dates[0] ? dates[0] : new Date();
      let temp = new Date();
      temp.setDate(yesterday.getDate() - 1);
      dates.unshift(temp);
    }
    chartLabels = dates.map(date => date.toISOString().replace(/T.+/, ''));
    this.service.getRevenue(dates).subscribe(res => {
      // this.datasets[0] = res;
      this.data = res;
      this.config = {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#ec250d',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ec250d',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ec250d',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.data,
          }]
        },
        options: gradientChartOptionsConfigurationWithTooltipRed
      };
    })
  }

  loadOrdersChart(){
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: null,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var chartLabels = [];
    let dates: Date[] = [];
    for (let i = 0; i < 5; ++i) {
      let yesterday: Date = dates[0] ? dates[0] : new Date();
      let temp = new Date();
      temp.setDate(yesterday.getDate() - 1);
      dates.unshift(temp);
    }
    chartLabels = dates.map(date => date.toISOString().replace(/T.+/, ''));
    this.service.getOrderAnalysis(dates).subscribe(res => {
      // this.datasets[0] = res;
      this.data = res;
      console.log(res);
      this.config = {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#ec250d',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ec250d',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ec250d',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.data,
          }]
        },
        options: gradientChartOptionsConfigurationWithTooltipRed
      };
    })
  }

  loadCustomerChart(){
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: null,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var chartLabels = [];
    let dates: Date[] = [];
    for (let i = 0; i < 5; ++i) {
      let yesterday: Date = dates[0] ? dates[0] : new Date();
      let temp = new Date();
      temp.setDate(yesterday.getDate() - 1);
      dates.unshift(temp);
    }
    chartLabels = dates.map(date => date.toISOString().replace(/T.+/, ''));
    this.service.getCustomerAnalysis(dates).subscribe(res => {
      // this.datasets[0] = res;
      this.data = res;
      console.log(res);
      this.config = {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#ec250d',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ec250d',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ec250d',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.data,
          }]
        },
        options: gradientChartOptionsConfigurationWithTooltipRed
      };
    })
  }
}
  //  var gradientChartOptionsConfigurationWithTooltipBlue: any = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.0)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 60,
  //           suggestedMax: 125,
  //           padding: 20,
  //           fontColor: "#2380f7"
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#2380f7"
  //         }
  //       }]
  //     }
  //   };

  //   var gradientChartOptionsConfigurationWithTooltipPurple: any = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.0)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 60,
  //           suggestedMax: 125,
  //           padding: 20,
  //           fontColor: "#9a9a9a"
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(225,78,202,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#9a9a9a"
  //         }
  //       }]
  //     }
  //   };

  //   var gradientChartOptionsConfigurationWithTooltipOrange: any = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.0)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 50,
  //           suggestedMax: 110,
  //           padding: 20,
  //           fontColor: "#ff8a76"
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(220,53,69,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#ff8a76"
  //         }
  //       }]
  //     }
  //   };

  //   var gradientChartOptionsConfigurationWithTooltipGreen: any = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.0)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 50,
  //           suggestedMax: 125,
  //           padding: 20,
  //           fontColor: "#9e9e9e"
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(0,242,195,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#9e9e9e"
  //         }
  //       }]
  //     }
  //   };

  //   var gradientBarChartConfiguration: any = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{

  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 60,
  //           suggestedMax: 120,
  //           padding: 20,
  //           fontColor: "#9e9e9e"
  //         }
  //       }],

  //       xAxes: [{

  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#9e9e9e"
  //         }
  //       }]
  //     }
  //   }