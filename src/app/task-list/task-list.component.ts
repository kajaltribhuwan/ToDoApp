import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { datamodel } from '../model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  taskForm!: FormGroup;
  data: datamodel[] = [];
  filteredData$: Observable<datamodel[]> | undefined;
  searchControl = new BehaviorSubject<string>('');
  page = 1;
  itemsPerPage = 10;
  searchTerm: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      date: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.searchControl = new BehaviorSubject<string>('');
    this.getTask();
  }

  refresh(): void {
    this.searchTerm = ''; // Clear the search term
    this.searchControl.next(this.searchTerm); // Trigger a search with an empty term
    this.getTask(); // Reload the task data
  }

  addTask(data: datamodel): void {
    this.api.addTask(data).subscribe(() => {
      this.taskForm.reset();
      this.getTask();
    });
  }

  getTask(): void {
    this.api.getTask().subscribe((res) => {
      this.data = res || [];
      this.filteredData$ = this.searchControl.pipe(
        debounceTime(300),
        map((searchTerm) => this.paginate(this.filterData(searchTerm)))
      );
    });
  }

  filterData(searchTerm: string): datamodel[] {
    if (!searchTerm.trim()) {
      return this.data; // Return all data if the search term is empty
    }

    return this.data.filter(
      (item) =>
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  onSearch(): void {
    console.log('Search term:', this.searchTerm); // Debugging line
    this.searchControl.next(this.searchTerm);
  }

  paginate(data: datamodel[]): datamodel[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return data.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(newPage: number): void {
    this.page = Math.max(1, newPage); // Ensure page is at least 1
    this.filteredData$ = this.searchControl.pipe(
      debounceTime(300),
      map((searchTerm) => this.paginate(this.filterData(searchTerm)))
    );
  }

  delete(id: number): void {
    const confirmation = window.confirm(
      'Are you sure you want to delete this task?'
    );
    if (confirmation) {
      this.api.deleteTask(id).subscribe(() => {
        alert('Task Deleted');
        this.getTask();
      });
    }
  }

  editTask(id: number): void {
    this.router.navigate(['/task-form', id]);
  }
}
