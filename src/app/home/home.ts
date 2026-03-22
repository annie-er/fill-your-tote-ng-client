import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { ContactMessage } from '../models/contact-message.model';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  formData: ContactMessage = {
    fullName: '',
    pronouns: '',
    email: '',
    company: '',
    websiteOrProfile: '',
    dueDate: '',
    budget: '',
    message: ''
  };

  isSubmitting = false;
  submitStatus: 'success' | 'error' | null = null;

  expandedQuestion: number | null = null;
 
  readonly processImagePath = '/assets/process.png';
 
  faqData: FaqItem[] = [
    {
      id: 1,
      question: "Where does your business run?",
      answer: "Fill your tote! is based in Richmond Hill and serves customers in the Greater Toronto Area."
    },
    {
      id: 2,
      question: "How long do commissions take?",
      answer: "It usually takes about 1.5-2 months."
    },
    {
      id: 3,
      question: "Where have your totes been seen?",
      answer: "Fill your tote! has been seen at the City of Richmond Hill's Fire and Emergency Services' Project Blaze, Cozy Grotto, Mr. Surprise, CNE, and the Church Assembly in Toronto."
    }
  ];
 
  constructor(private contactService: ContactService) {}

  toggleQuestion(questionId: number): void {
    this.expandedQuestion = this.expandedQuestion === questionId ? null : questionId;
  }
 
  isExpanded(questionId: number): boolean {
    return this.expandedQuestion === questionId;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = null;

    const contactData: ContactMessage = {
      fullName: form.value.fullName,
      pronouns: form.value.pronouns,
      email: form.value.email,
      company: form.value.company,
      websiteOrProfile: form.value.websiteOrProfile,
      dueDate: form.value.dueDate,
      budget: form.value.budget,
      message: form.value.message
    };

    this.contactService.submitContactForm(contactData).subscribe({
      next: () => {
        this.submitStatus = 'success';
        this.isSubmitting = false;
        form.reset();
      },
      error: () => {
        this.submitStatus = 'error';
        this.isSubmitting = false;
      }
    });
  }
}
