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
    const initialLength = component.workoutList.length;
    const newWorkout: Workout = { personName: 'Jane', type: 'Yoga', minutes: 45 };
    component.addWorkoutToList(newWorkout);
    expect(component.workoutList).toContain(jasmine.objectContaining(newWorkout));
    expect(component.workoutList.length).toBe(initialLength + 1);
  });

  it('should delete a workout', () => {
    const initialLength = component.workoutList.length;
    const workoutToDelete = component.workoutList[0];
    component.deleteWorkout(workoutToDelete);
    expect(component.workoutList).not.toContain(workoutToDelete);
    expect(component.workoutList.length).toBe(initialLength - 1);
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

  it('should update workoutList after adding a workout', () => {
    const newWorkout: Workout = { personName: 'New Person', type: 'New Type', minutes: 10 };
    component.addWorkoutToList(newWorkout);
    expect(component.workoutList).toContain(newWorkout);
  });

  it('should handle deleting a non-existent workout', () => {
    const nonExistentWorkout: Workout = { personName: 'Non-Existent', type: 'Non-Existent', minutes: 0 };
    const initialLength = component.workoutList.length;
    component.deleteWorkout(nonExistentWorkout);
    expect(component.workoutList.length).toBe(initialLength);
  });

  it('should adjust currentPage after deleting workouts and reducing totalPages', () => {
    component.workoutList = [
      { personName: 'Workout 1', type: 'Running', minutes: 30 },
      { personName: 'Workout 2', type: 'Swimming', minutes: 40 },
      { personName: 'Workout 3', type: 'Cycling', minutes: 50 },
      { personName: 'Workout 4', type: 'Running', minutes: 60 },
      { personName: 'Workout 5', type: 'Swimming', minutes: 70 },
      { personName: 'Workout 6', type: 'Cycling', minutes: 80 },
    ];
    component.itemsPerPage = 2;
    component.currentPage = 3;
    component.deleteWorkout(component.workoutList[0]);
    component.deleteWorkout(component.workoutList[0]);
    component.deleteWorkout(component.workoutList[0]);
    component.deleteWorkout(component.workoutList[0]);
    component.deleteWorkout(component.workoutList[0]);
    component.adjustPaginationAfterDelete();
    expect(component.currentPage).toBe(1);
  });

  it('should handle totalPages being 0', () => {
    component.workoutList = [];
    component.updatePagination();
    expect(component.totalPages).toBe(1);
  });

  it('should delete a workout from the WorkoutService', () => {
    const workoutService = TestBed.inject(WorkoutService);
    const initialWorkouts = workoutService.getWorkouts();
    const initialLength = initialWorkouts.length;
    const workoutToDelete = initialWorkouts[0];
    workoutService.deleteWorkout(workoutToDelete);
    const updatedWorkouts = workoutService.getWorkouts();
    expect(updatedWorkouts.length).toBe(initialLength - 1);
    expect(updatedWorkouts.find(w => w.personName === workoutToDelete.personName)).toBeUndefined();
  });
});