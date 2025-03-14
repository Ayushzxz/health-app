import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutFormComponent } from './workoutform.component';
import { Workout } from '../../shared/workout.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let formBuilder: FormBuilder;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, WorkoutFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    formBuilder = TestBed.inject(FormBuilder);

    component.workoutForm = formBuilder.group({
      personName: ['', Validators.required],
      type: ['', Validators.required],
      minutes: [0, [Validators.required, Validators.min(1), Validators.max(300)]],
    });
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit workoutAdded event when form is invalid', () => {
    const emitSpy = spyOn(component.workoutAdded, 'emit');

    component.workoutForm.controls['minutes'].setValue(0);
    component.addWorkout();
    expect(emitSpy).not.toHaveBeenCalled();

    component.workoutForm.controls['minutes'].setValue(30);
    component.workoutForm.controls['personName'].setValue('');
    component.addWorkout();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit workout data when `addWorkout()` is called with a valid form', () => {
    spyOn(component.workoutAdded, 'emit');
    component.workoutForm.setValue({ personName: 'John Doe', type: 'Running', minutes: 30 });
    component.addWorkout();
    expect(component.workoutAdded.emit).toHaveBeenCalledWith({
      personName: 'John Doe',
      type: 'Running',
      minutes: 30,
    });
  });
  it('should update personName input field', () => {
    const inputElement: HTMLInputElement = debugElement.query(By.css('#personName')).nativeElement;
    inputElement.value = 'Alice Smith';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.workoutForm.get('personName')?.value).toBe('Alice Smith');
  });
  it('should update minutes input field', () => {
    const inputElement: HTMLInputElement = debugElement.query(By.css('#minutes')).nativeElement;
    inputElement.value = '60';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.workoutForm.get('minutes')?.value).toBe(60);
  });

  it('should not emit workoutAdded event when personName is empty', () => {
    component.workoutForm.controls['personName'].markAsTouched();
    component.workoutForm.setValue({
      personName: '',
      type: 'Running',
      minutes: 30,
    });
    spyOn(component.workoutAdded, 'emit');
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  });

  it('should not emit workoutAdded event when type is empty', () => {
    component.workoutForm.controls['type'].markAsTouched();
    component.workoutForm.setValue({
      personName: 'John Doe',
      type: '',
      minutes: 30,
    });
    spyOn(component.workoutAdded, 'emit');
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  });

  it('should not emit workoutAdded event when minutes is 0', () => {
    component.workoutForm.controls['minutes'].markAsTouched();
    component.workoutForm.setValue({
      personName: 'John Doe',
      type: 'Running',
      minutes: 0,
    });
    spyOn(component.workoutAdded, 'emit');
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  });

  it('should not emit workoutAdded event when minutes is less than 1', () => {
    component.workoutForm.controls['minutes'].markAsTouched();
    component.workoutForm.setValue({
      personName: 'John Doe',
      type: 'Running',
      minutes: -1,
    });
    spyOn(component.workoutAdded, 'emit');
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  });

  it('should not emit workoutAdded event when minutes is greater than 300', () => {
    component.workoutForm.controls['minutes'].markAsTouched();
    component.workoutForm.setValue({
      personName: 'John Doe',
      type: 'Running',
      minutes: 301,
    });
    spyOn(component.workoutAdded, 'emit');
    component.addWorkout();
    expect(component.workoutAdded.emit).not.toHaveBeenCalled();
  });

  it('should display and clear confirmation message', fakeAsync(() => {
    component.workoutForm.setValue({
      personName: 'Test Name',
      type: 'Running',
      minutes: 60,
    });
    component.addWorkout();
    fixture.detectChanges();
    expect(component.message).toBe('Workout added successfully!');
    tick(3000);
    fixture.detectChanges();
    expect(component.message).toBeNull();
  }));
});
