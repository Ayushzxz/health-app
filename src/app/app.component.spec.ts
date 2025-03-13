import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WorkoutService } from './workout.service';
import { Workout } from './shared/workout.model';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, AppComponent],
      providers: [WorkoutService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
  });

  it('should initialize workoutList with data from WorkoutService', () => {
    const mockWorkouts: Workout[] = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
      { personName: 'Jane Smith', type: 'Swimming', minutes: 60 },
      { personName: 'Mike Johnson', type: 'Yoga', minutes: 50 },
      { personName: 'Emily Davis', type: 'Cycling', minutes: 45 },
      { personName: 'David Lee', type: 'Weightlifting', minutes: 75 },
      { personName: 'Sarah Jones', type: 'Running', minutes: 25 },
      { personName: 'Michael Brown', type: 'Swimming', minutes: 35 },
      { personName: 'Ashley Green', type: 'Yoga', minutes: 60 },
    ];
    spyOn(workoutService, 'getWorkouts').and.returnValue(mockWorkouts);

    fixture.detectChanges();

    expect(component.workoutList).toEqual(mockWorkouts);
  });

  describe('filteredWorkouts', () => {
    beforeEach(() => {
      component.workoutList = [
        { personName: 'John Doe', type: 'Running', minutes: 30 },
        { personName: 'Jane Smith', type: 'Yoga', minutes: 45 },
        { personName: 'Peter Jones', type: 'Running', minutes: 60 },
      ];
    });

    it('should return all workouts when no filter is applied', () => {
      expect(component.filteredWorkouts).toEqual(component.workoutList);
    });

    it('should filter by searchTerm', () => {
      component.searchTerm = 'john';
      expect(component.filteredWorkouts).toEqual([
        { personName: 'John Doe', type: 'Running', minutes: 30 },
      ]);
    });

    it('should filter by filterType', () => {
      component.filterType = 'Yoga';
      expect(component.filteredWorkouts).toEqual([
        { personName: 'Jane Smith', type: 'Yoga', minutes: 45 },
      ]);
    });

    it('should filter by both searchTerm and filterType', () => {
      component.searchTerm = 'john';
      component.filterType = 'Running';
      expect(component.filteredWorkouts).toEqual([
        { personName: 'John Doe', type: 'Running', minutes: 30 },
      ]);
    });
  });

  describe('paginatedWorkouts', () => {
    beforeEach(() => {
      component.workoutList = [
        { personName: 'John Doe', type: 'Running', minutes: 30 },
        { personName: 'Jane Smith', type: 'Yoga', minutes: 45 },
        { personName: 'Peter Jones', type: 'Running', minutes: 60 },
        { personName: 'Alice Brown', type: 'Cycling', minutes: 30 },
        { personName: 'Bob Green', type: 'Swimming', minutes: 45 },
        { personName: 'Charlie White', type: 'Running', minutes: 60 },
      ];
    });

    it('should paginate workouts correctly', () => {
      component.itemsPerPage = 2;
      component.currentPage = 1;
      expect(component.paginatedWorkouts).toEqual([
        { personName: 'John Doe', type: 'Running', minutes: 30 },
        { personName: 'Jane Smith', type: 'Yoga', minutes: 45 },
      ]);

      component.currentPage = 2;
      expect(component.paginatedWorkouts).toEqual([
        { personName: 'Peter Jones', type: 'Running', minutes: 60 },
        { personName: 'Alice Brown', type: 'Cycling', minutes: 30 },
      ]);

      component.currentPage = 3;
      expect(component.paginatedWorkouts).toEqual([
        { personName: 'Bob Green', type: 'Swimming', minutes: 45 },
        { personName: 'Charlie White', type: 'Running', minutes: 60 },
      ]);
    });

    it('should calculate totalPages correctly', () => {
      component.itemsPerPage = 2;
      expect(component.totalPages).toBe(3);

      component.itemsPerPage = 3;
      expect(component.totalPages).toBe(2);
    });
  });

  it('should add a new workout', () => {
    spyOn(workoutService, 'addWorkout');
    component.workoutList = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
      { personName: 'Jane Smith', type: 'Swimming', minutes: 60 },
      { personName: 'Mike Johnson', type: 'Yoga', minutes: 50 },
      { personName: 'Emily Davis', type: 'Cycling', minutes: 45 },
      { personName: 'David Lee', type: 'Weightlifting', minutes: 75 },
      { personName: 'Sarah Jones', type: 'Running', minutes: 25 },
      { personName: 'Michael Brown', type: 'Swimming', minutes: 35 },
      { personName: 'Ashley Green', type: 'Yoga', minutes: 60 },
    ];
    const newWorkout: Workout = { personName: 'Jane', type: 'Yoga', minutes: 45 };

    component.addWorkoutToList(newWorkout);

    expect(workoutService.addWorkout).toHaveBeenCalledWith(newWorkout);
    expect(component.workoutList).toContain(newWorkout);
    expect(component.currentPage).toBe(1);
  });

  it('should delete a workout', () => {
    spyOn(workoutService, 'deleteWorkout');
    component.workoutList = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
      { personName: 'Jane Smith', type: 'Swimming', minutes: 60 },
      { personName: 'Mike Johnson', type: 'Yoga', minutes: 50 },
      { personName: 'Emily Davis', type: 'Cycling', minutes: 45 },
      { personName: 'David Lee', type: 'Weightlifting', minutes: 75 },
      { personName: 'Sarah Jones', type: 'Running', minutes: 25 },
      { personName: 'Michael Brown', type: 'Swimming', minutes: 35 },
      { personName: 'Ashley Green', type: 'Yoga', minutes: 60 },
    ];
    const workoutToDelete: Workout = component.workoutList[0];

    component.deleteWorkout(workoutToDelete);

    expect(workoutService.deleteWorkout).toHaveBeenCalledWith(workoutToDelete);
    expect(component.workoutList).not.toContain(workoutToDelete);
  });

  describe('goToPage', () => {
    beforeEach(() => {
      component.totalPages = 5;
    });

    it('should go to a valid page', () => {
      component.goToPage(3);
      expect(component.currentPage).toBe(3);
    });

    it('should not go to an invalid page', () => {
      component.goToPage(0);
      expect(component.currentPage).toBe(1);

      component.goToPage(6);
      expect(component.currentPage).toBe(5);
    });
  });

  it('should reset pagination', () => {
    component.currentPage = 3;
    component.resetPagination();
    expect(component.currentPage).toBe(1);
  });

  it('should adjust pagination after delete', () => {
    component.workoutList = [
      { personName: 'John Doe', type: 'Running', minutes: 30 },
      { personName: 'Jane Smith', type: 'Yoga', minutes: 45 },
    ];
    component.itemsPerPage = 1;
    component.currentPage = 2;

    component.deleteWorkout(component.workoutList[1]);

    expect(component.totalPages).toBe(1);
    expect(component.currentPage).toBe(1);
  });
});