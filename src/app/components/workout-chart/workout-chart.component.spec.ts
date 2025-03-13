import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { Workout } from '../../shared/workout.model';
import { Chart } from 'chart.js/auto';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutChartComponent], // Correct: Use imports for standalone components
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the chart on initialization', () => {
    const createChartSpy = spyOn(component, 'createChart').and.callThrough();
    fixture.detectChanges(); // Trigger ngAfterViewInit

    expect(createChartSpy).toHaveBeenCalled();
    expect(component.chart).toBeTruthy();
  });

  it('should update the chart when workoutList changes', () => {
    fixture.detectChanges(); // Initialize chart

    const updateChartSpy = spyOn(component, 'updateChart').and.callThrough();

    component.workoutList = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
      { personName: 'Jane Doe', type: 'Yoga', minutes: 40 }
    ];

    component.ngOnChanges();

    expect(updateChartSpy).toHaveBeenCalled();
    expect(component.chart.data.labels).toEqual([
      'John Doe - Running',
      'Jane Doe - Yoga'
    ]);
  });

  it('should display an empty chart when no data is provided', () => {
    fixture.detectChanges(); // Initialize chart

    component.workoutList = [];
    component.ngOnChanges();

    expect(component.chart.data.labels.length).toBe(0);
  });
});