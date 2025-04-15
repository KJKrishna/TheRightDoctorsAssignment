import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private people: Person[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
  ];

  getPeople(): Observable<Person[]> {
    return of(this.people);
  }

  getPerson(id: number): Observable<Person | undefined> {
    return of(this.people.find(p => p.id === id));
  }

  updatePerson(person: Person): Observable<Person> {
    const index = this.people.findIndex(p => p.id === person.id);
    if (index !== -1) {
      this.people[index] = person;
    }
    return of(person);
  }

  deletePerson(id: number): Observable<void> {
    this.people = this.people.filter(p => p.id !== id);
    return of(void 0);
  }
}