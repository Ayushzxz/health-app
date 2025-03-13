import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { WorkoutFormComponent } from './components/workoutform/workoutform.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutChartComponent } from './components/workout-chart/workout-chart.component';
import { Workout } from './shared/workout.model';
import { WorkoutService } from '../app/workout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, WorkoutFormComponent, WorkoutListComponent, WorkoutChartComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-r from-blue-50 to-blue-200 flex flex-col items-center justify-center py-6">
      <app-header></app-header>

      <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mt-6 bg-opacity-90 backdrop-blur-md border border-white/20">
        <app-workout-form (workoutAdded)="addWorkoutToList($event)"></app-workout-form>
      </div>

      <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mt-6 bg-opacity-90 backdrop-blur-md border border-white/20">
        <app-workout-chart [workoutList]="filteredWorkouts"></app-workout-chart>

        <h2 class="text-3xl font-semibold text-gray-800 mb-6 text-center">Workout List</h2>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <input
            type="text"
            id="search"
            placeholder="Search by name"
            [(ngModel)]="searchTerm"
            (input)="resetPagination()"
            class="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
          />

          <select
            id="filterType"
            [(ngModel)]="filterType"
            (change)="resetPagination()"
            class="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
          >
            <option value="">All Workout Types</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Swimming">Swimming</option>
            <option value="Yoga">Yoga</option>
            <option value="Weightlifting">Weightlifting</option>
          </select>
        </div>

        <app-workout-list
          [workoutList]="paginatedWorkouts"
          (workoutDeleted)="deleteWorkout($event)"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="goToPage($event)"
        >
        </app-workout-list>
      </div>
    </div>
  `,
  styles: [], // Corrected the missing styles array
})
export class AppComponent {
  title = 'health-tracker';
  workoutList: Workout[] = [];
  searchTerm: string = '';
  filterType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private workoutService: WorkoutService) {
    this.workoutList = this.workoutService.getWorkouts();
    this.updatePagination(); // Call updatePagination on init.
  }

  get filteredWorkouts(): Workout[] { // Corrected to Workout[]
    return this.workoutList.filter(
      (workout) =>
        workout.personName.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.filterType === '' || workout.type === this.filterType)
    );
  }

  get paginatedWorkouts(): Workout[] { // Corrected to Workout[]
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredWorkouts.length);
    this.totalPages = Math.ceil(this.filteredWorkouts.length / this.itemsPerPage);

    return this.filteredWorkouts.slice(startIndex, endIndex);
  }

  addWorkoutToList(workoutData: Workout) {
    this.workoutService.addWorkout(workoutData);
    this.workoutList = this.workoutService.getWorkouts(); // Update workoutList after adding
    this.updatePagination();
  }

  deleteWorkout(workout: Workout) {
    this.workoutService.deleteWorkout(workout);
    this.workoutList = this.workoutService.getWorkouts(); // Update workoutList after deleting
    this.adjustPaginationAfterDelete();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    } else if (page < 1) {
      this.currentPage = 1; // Go to the first page if page is less than 1
    } else {
      this.currentPage = this.totalPages; // Go to the last page if page exceeds totalPages
    }
  }

  resetPagination() {
    this.currentPage = 1;
    this.updatePagination();
  }

  adjustPaginationAfterDelete() {
    this.updatePagination();
    this.totalPages = Math.ceil(this.filteredWorkouts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages; // Adjust to the new totalPages, not just Math.max(1, this.totalPages)
    }
  }
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredWorkouts.length / this.itemsPerPage);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
  }
}