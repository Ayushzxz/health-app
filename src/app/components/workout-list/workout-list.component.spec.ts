import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { Workout } from '../../shared/workout.model';
import { By } from '@angular/platform-browser';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render workout items when workoutList is provided', () => {
    const workouts: Workout[] = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
      { personName: 'Jane Smith', type: 'Yoga', minutes: 45 },
    ];
    component.workoutList = workouts;
    fixture.detectChanges();
    const workoutItems = fixture.debugElement.queryAll(By.css('tr.border-t'));
    expect(workoutItems.length).toBe(2);
  });

  it('should display "No workouts found." when workoutList is empty', () => {
    component.workoutList = [];
    fixture.detectChanges();
    const noWorkoutsMessage = fixture.debugElement.query(By.css('p.text-gray-700'));
    expect(noWorkoutsMessage.nativeElement.textContent).toContain('No workouts found.');
  });

  it('should emit workoutDeleted event when delete button is clicked', () => {
    const workouts: Workout[] = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
    ];
    component.workoutList = workouts;
    fixture.detectChanges();
    spyOn(component.workoutDeleted, 'emit');
    const deleteButton = fixture.debugElement.query(By.css('button.text-red-600'));
    deleteButton.triggerEventHandler('click', null);
    expect(component.workoutDeleted.emit).toHaveBeenCalledWith(workouts[0]);
  });

  it('should emit pageChange event when prevPage is called', () => {
    component.currentPage = 2;
    spyOn(component.pageChange, 'emit');
    component.prevPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should emit pageChange event when nextPage is called', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should emit pageChange event when goToPage is called', () => {
    component.totalPages = 5; 
    fixture.detectChanges(); 
    spyOn(component.pageChange, 'emit');
    component.goToPage(3);
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });
});