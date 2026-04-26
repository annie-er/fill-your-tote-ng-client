import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [FormsModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isSubmitting = false;
  submitStatus: 'success' | 'error' | null = null;
  expandedQuestion: number | null = null;

  // File upload
  selectedFile: File | null = null;
  fileError = '';
  formSubmitted = false;

  readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  readonly maxFileSize = 5 * 1024 * 1024; // 5MB

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.fileError = '';
    this.selectedFile = null;

    if (!file) return;

    if (!this.allowedTypes.includes(file.type)) {
      this.fileError = 'Invalid file type. Please upload a JPEG, PNG, GIF, WebP, or PDF.';
      return;
    }

    if (file.size > this.maxFileSize) {
      this.fileError = 'File must not exceed 5MB.';
      return;
    }

    this.selectedFile = file;
  }

  removeFile() {
    this.selectedFile = null;
    this.fileError = '';
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true;   

    if (form.invalid) return;    

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

    this.contactService.submitContactForm(contactData, this.selectedFile ?? undefined).subscribe({
      next: () => {
        this.submitStatus = 'success';
        this.isSubmitting = false;
        this.selectedFile = null;
        this.formSubmitted = false;   // ← reset on success
        form.reset();
      },
      error: () => {
        this.submitStatus = 'error';
        this.isSubmitting = false;
      }
    });
  }
}
