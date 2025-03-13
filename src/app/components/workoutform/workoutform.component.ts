import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workout } from '../../shared/workout.model';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Add New Workout</h2>
      <form [formGroup]="workoutForm" (ngSubmit)="addWorkout()" class="space-y-4">
        <div>
          <label for="personName" class="block text-sm font-medium text-gray-700">Name</label>
          <input id="personName" type="text" formControlName="personName" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span *ngIf="workoutForm.get('personName')?.hasError('required') && workoutForm.get('personName')?.touched" class="text-red-500 text-sm">Please enter a valid name.</span>
          <span *ngIf="workoutForm.get('personName')?.hasError('minlength') && workoutForm.get('personName')?.touched" class="text-red-500 text-sm">Name must be at least 3 characters.</span>
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Workout Type</label>
          <select id="type" formControlName="type" required class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="" disabled selected>Select Workout Type</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Swimming">Swimming</option>
            <option value="Yoga">Yoga</option>
            <option value="Weightlifting">Weightlifting</option>
          </select>
          <span *ngIf="workoutForm.get('type')?.hasError('required') && workoutForm.get('type')?.touched" class="text-red-500 text-sm">Please select a workout type.</span>
        </div>
        <div>
          <label for="minutes" class="block text-sm font-medium text-gray-700">Minutes</label>
          <input id="minutes" type="number" formControlName="minutes" required min="1" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span *ngIf="workoutForm.get('minutes')?.hasError('required') && workoutForm.get('minutes')?.touched" class="text-red-500 text-sm">Minutes should be greater than zero.</span>
          <span *ngIf="workoutForm.get('minutes')?.hasError('min') && workoutForm.get('minutes')?.touched" class="text-red-500 text-sm">Minutes should be greater than zero.</span>
          <span *ngIf="workoutForm.get('minutes')?.hasError('max') && workoutForm.get('minutes')?.touched" class="text-red-500 text-sm">Minutes cannot exceed 300.</span>
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200">Add Workout</button>
      </form>
    </div>
  `,
  styles: [],
})
export class WorkoutFormComponent {
  @Output() workoutAdded = new EventEmitter<Workout>();
  workoutForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      personName: [''],
      type: [''],
      minutes: [0, [Validators.required, Validators.min(1), Validators.max(300)]],
    });
  }

  resetForm() {
    this.workoutForm.setValue({
      personName: '',
      type: '',
      minutes: 0,
    });
  }

  addWorkout() {
    if (this.workoutForm.invalid) {
      return;
    }

    const workout: Workout = {
      personName: this.workoutForm.value.personName!,
      type: this.workoutForm.value.type!,
      minutes: this.workoutForm.value.minutes!,
    };

    this.workoutAdded.emit(workout);
    this.resetForm();
  }
}