import { Injectable } from '@angular/core';
import { Workout } from './shared/workout.model';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private workoutList: Workout[] = [
    { personName: 'John Doe', type: 'Running', minutes: 30 },
    { personName: 'Jane Smith', type: 'Swimming', minutes: 60 },
    { personName: 'Mike Johnson', type: 'Yoga', minutes: 50 },
    { personName: 'Emily Davis', type: 'Cycling', minutes: 45 },
    { personName: 'David Lee', type: 'Weightlifting', minutes: 75 },
    { personName: 'Sarah Jones', type: 'Running', minutes: 25 },
    { personName: 'Michael Brown', type: 'Swimming', minutes: 35 },
    { personName: 'Ashley Green', type: 'Yoga', minutes: 60 },
  ];

  getWorkouts(): Workout[]{
    console.log('WorkoutService getWorkouts:', this.workoutList);
    return this.workoutList; 
  }

  addWorkout(workout: Workout) {
    this.workoutList.push(workout); 
  }

  deleteWorkout(workout: Workout) {
    this.workoutList = this.workoutList.filter(
      (w) => w.personName !== workout.personName
    );
  }
}