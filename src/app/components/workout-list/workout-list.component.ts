import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workout } from '../../shared/workout.model';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="workoutList && workoutList.length > 0; else noWorkouts">
      <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Minutes</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-gray-100">
          <tr *ngFor="let workout of workoutList; let i = index" class="border-t">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ workout.personName }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ workout.type }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ workout.minutes }}</td>
            <td class="px-6 py-4 text-sm font-medium">
              <button
                (click)="deleteWorkout(workout)"
                class="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center items-center mt-6">
  <button
    (click)="prevPage()"
    [disabled]="currentPage === 1"
    class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Previous
  </button>

  <ng-container *ngFor="let page of pages">
    <button
        (click)="goToPage(page)"
        [attr.aria-current]="page === currentPage ? 'page' : null"
        class="page-button px-4 py-2 mx-1 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        [ngClass]="{
            'bg-blue-500 text-white hover:bg-blue-700': page === currentPage,
            'bg-white text-gray-700': page !== currentPage
        }"
    >
        {{ page }} </button>
</ng-container>

  <button
    (click)="nextPage()"
    [disabled]="currentPage === totalPages"
    class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700
     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
      disabled:cursor-not-allowed"
  >
    Next
  </button>
</div>
    </div>

    <ng-template #noWorkouts>
    <div class="mt-6 text-center p-6 bg-gray-200 rounded-lg shadow-md">
    <p class="text-gray-700 text-lg font-semibold">No workouts found.</p>
  </div>
    </ng-template>
  `,
  styles: [],
})
export class WorkoutListComponent implements OnChanges {
    @Input() currentPage: number = 1;
    @Input() totalPages: number = 0;
    @Output() workoutDeleted = new EventEmitter<Workout>();
    @Output() pageChange = new EventEmitter<number>();
    @Input() workoutList: Workout[] = [];

    get pages(): number[] {
        if (this.totalPages > 0) {
            return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        } else {
            return [];
        }
    }

  deleteWorkout(workout: Workout) {
    this.workoutDeleted.emit(workout);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page); 
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalPages']) {
      console.log(this.pages); 
    }
  }
}
