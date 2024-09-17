import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { datamodel } from '../model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  public dataid!: number;
  public task: datamodel = {
    // Initialize with default values including id as number
    id: 0, // Default value for id
    assignedTo: '',
    status: '',
    date: '',
    priority: '',
    description: '',
  };

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe((params) => {
      this.dataid = +params.get('id')!;
      this.fetchTask();
    });
  }

  fetchTask(): void {
    this.api.fetchdata(this.dataid).subscribe(
      (data: datamodel) => {
        this.task = data;
      },
      (error) => {
        console.error('Error fetching task:', error);
      }
    );
  }

  updateTask(): void {
    this.api.updateTask(this.dataid, this.task).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }
}
