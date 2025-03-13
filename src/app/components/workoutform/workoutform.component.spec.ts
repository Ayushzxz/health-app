import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { WorkoutFormComponent } from './workoutform.component';
import { Workout } from '../../shared/workout.model';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    component.workoutForm = formBuilder.group({
      personName: [''],
      type: [''],
      minutes: [0],
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit workout data when `addWorkout()` is called', () => {
    spyOn(component.workoutAdded, 'emit');
    component.workoutForm.setValue({ personName: 'John Doe', type: 'Running', minutes: 30 });
    component.addWorkout();
    expect(component.workoutAdded.emit).toHaveBeenCalledWith({
      personName: 'John Doe',
      type: 'Running',
      minutes: 30,
    });
  });

  it('should reset the form after adding a workout', () => {
    component.workoutForm.setValue({ personName: 'John Doe', type: 'Running', minutes: 30 });
    component.addWorkout();
    expect(component.workoutForm.value).toEqual({
      personName: '',
      type: '',
      minutes: 0,
    });
  });
});