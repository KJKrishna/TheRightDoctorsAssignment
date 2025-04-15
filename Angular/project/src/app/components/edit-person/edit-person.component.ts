import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Person } from '../../models/person.model';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Edit Person</h2>
      <form (ngSubmit)="onSubmit()" *ngIf="person">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" class="form-control" [(ngModel)]="person.name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" class="form-control" [(ngModel)]="person.email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" class="form-control" [(ngModel)]="person.phone" name="phone" required>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-danger" routerLink="/">Cancel</button>
      </form>
    </div>
  `
})
export class EditPersonComponent implements OnInit {
  person?: Person;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.peopleService.getPerson(id).subscribe(person => {
      this.person = person;
    });
  }

  onSubmit() {
    if (this.person) {
      this.peopleService.updatePerson(this.person).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}