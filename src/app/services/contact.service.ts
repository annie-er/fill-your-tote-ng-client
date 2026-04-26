import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../models/contact-message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitContactForm(message: ContactMessage, file?: File): Observable<ContactMessage> {
    const formData = new FormData();

    formData.append('fullName', message.fullName);
    formData.append('email', message.email);
    formData.append('message', message.message);

    if (message.pronouns)        formData.append('pronouns', message.pronouns);
    if (message.company)         formData.append('company', message.company);
    if (message.websiteOrProfile) formData.append('websiteOrProfile', message.websiteOrProfile);
    if (message.dueDate)         formData.append('dueDate', message.dueDate);
    if (message.budget)          formData.append('budget', message.budget);
    if (file)                    formData.append('file', file);

    return this.http.post<ContactMessage>(this.apiUrl, formData);
  }
}