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
      imports: [WorkoutChartComponent],
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
    fixture.detectChanges(); 

    expect(createChartSpy).toHaveBeenCalled();
    expect(component.chart).toBeTruthy();
  });

  it('should update the chart when workoutList changes', () => {
    fixture.detectChanges(); 

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
    fixture.detectChanges(); 
    component.workoutList = [];
    component.ngOnChanges();
    expect(component.chart.data.labels.length).toBe(0);
  });
  it('should format tooltip label correctly', () => {
    component.workoutList = [{ personName: 'Test Person', type: 'Run', minutes: 30 }];
    fixture.detectChanges(); 
    const tooltipItem = { raw: 30 };
    const labelFunction = component.chart.options.plugins.tooltip.callbacks.label;
    const result = labelFunction(tooltipItem);
    expect(result).toBe('30 Minutes');
  });
});