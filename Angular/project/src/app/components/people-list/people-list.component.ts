import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>People List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let person of people">
            <td>{{ person.name }}</td>
            <td>{{ person.email }}</td>
            <td>{{ person.phone }}</td>
            <td>
              <button class="btn btn-primary" [routerLink]="['/edit', person.id]">Edit</button>
              <button class="btn btn-danger" (click)="deletePerson(person.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];

  constructor(private peopleService: PeopleService) {}

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople() {
    this.peopleService.getPeople().subscribe(people => {
      this.people = people;
    });
  }

  deletePerson(id: number) {
    if (confirm('Are you sure you want to delete this person?')) {
      this.peopleService.deletePerson(id).subscribe(() => {
        this.loadPeople();
      });
    }
  }
}