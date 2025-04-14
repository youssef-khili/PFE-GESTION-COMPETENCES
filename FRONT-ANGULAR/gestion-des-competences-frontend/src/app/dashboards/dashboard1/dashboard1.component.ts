import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ChartService} from '../services/chart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit {

  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public chartOptions: Partial<any> | undefined;
  public avgLevels: number[] = [];
  public skills: string[] = [];

  constructor(private chartService: ChartService) {
    this.loadData();
    this.initializeChatOption(this.avgLevels, this.skills);
  }

  ngOnInit(): void {
  }
  loadData(): void {
    this.chartService.getHistogramChartValues().subscribe(results => {
      if (results) {
        results.forEach((elet: any) => {
          this.avgLevels.push(elet.avgLevel);
          this.skills.push(elet.Skill.name);
        });
      }
    });
  }

  applyFilter($event: any): void {
    const avgLevels: number[] = [];
    const skills: string[] = [];
    $event.forEach((elet: any) => {
      avgLevels.push(elet.avgLevel);
      skills.push(elet.Skill.name);
    });
    this.initializeChatOption(avgLevels, skills);
  }

  initializeChatOption(avgLevels: any, skills: any): void {
    this.chartOptions = {
      series: [
        {
          name: 'Mean level',
          data: avgLevels
        }
      ],
      chart: {
        type: 'bar',
        fontFamily: 'Poppins,sans-serif',
        height: 250,
      },
      grid: {
        borderColor: 'rgba(0,0,0,.2)',
        strokeDashArray: 3,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          endingShape: 'flat'
        },

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: skills
      },

      legend: {
        show: false,
      },
      fill: {
        colors: ['#26c6da', '#1e88e5'],
        opacity: 1
      },
      tooltip: {
        theme: 'light',
        fillSeriesColor: false,
        marker: {
          show: false,
        },
      }
    };

  }

}
