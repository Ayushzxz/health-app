import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Workout } from '../../shared/workout.model'; 

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #workoutChart></canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        height: 400px;
        padding: 20px;
      }
    `
  ]
})
export class WorkoutChartComponent implements AfterViewInit, OnChanges {
  @Input() workoutList: Workout[] = [];
  @ViewChild('workoutChart') workoutChart!: ElementRef;
  chart: any;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  createChart() {
    if (this.workoutChart && this.workoutChart.nativeElement) {
      const ctx = this.workoutChart.nativeElement.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.workoutList.map(workout => `${workout.personName} - ${workout.type}`),
            datasets: [{
              label: 'Minutes',
              data: this.workoutList.map(workout => workout.minutes),
              backgroundColor: this.generateColorArray(this.workoutList.length),
              borderColor: this.generateColorArray(this.workoutList.length, true),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { 
                  display: true,
                  text: 'Minutes'
                },
                ticks: {
                  stepSize: 5
                }
              },
              x: { 
                title: {
                  display: true,
                  text: 'Workout'
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5
                }
              }
            },
            plugins: { 
              title: {
                display: true,
                text: 'Workout Progress',
                font: {
                  size: 18
                }
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem: any) {
                    return `${tooltipItem.raw} Minutes`;
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.workoutList.map(workout => `${workout.personName} - ${workout.type}`);
      this.chart.data.datasets[0].data = this.workoutList.map(workout => workout.minutes);
      this.chart.update();
    }
  }

  private generateColorArray(count: number, border: boolean = false): string[] {
    const baseColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
    ];

    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];

    const colors = border ? borderColors : baseColors;
    return Array(count).fill(null).map((_, index) => colors[index % colors.length]);
  }
}
