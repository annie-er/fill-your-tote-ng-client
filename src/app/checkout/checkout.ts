import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { injectStripe, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { CartService } from '../services/cart.service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, StripePaymentElementComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement?: StripePaymentElementComponent;

  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private stripe = injectStripe();
  private cartService = inject(CartService);

  cartItems = this.cartService.loadedCartItems;
  cartSummary = this.cartService.loadedCartSummary;

  isLoading = signal(false);
  isStripeReady = signal(false);
  errorMessage = signal('');

  elementsOptions = signal<StripeElementsOptions>({
    locale: 'en'
  });

  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
  });

  ngOnInit() {
    this.cartService.loadCartSummary().subscribe({
      next: () => {
        this.cartService.loadCartItems().subscribe();
        this.paymentService.createPaymentIntent().subscribe({
          next: (response) => {
            this.elementsOptions.set({
              locale: 'en',
              clientSecret: response.clientSecret
            });

            this.isStripeReady.set(true);
          },
          error: (err) => {
            console.error('payment intent error', err);
            this.errorMessage.set('Failed to initialize payment.');
          }
        });
      },
      error: () => {
        this.errorMessage.set('Failed to load cart.');
      }
    });
  }

  pay() {
    if (this.checkoutForm.invalid || !this.paymentElement) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.stripe.confirmPayment({
      elements: this.paymentElement.elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: this.checkoutForm.value.fullName!,
            email: this.checkoutForm.value.email!,
            address: {
              line1: this.checkoutForm.value.address!,
              city: this.checkoutForm.value.city!,
              postal_code: this.checkoutForm.value.postalCode!,
              country: 'CA'
            }
          }
        }
      },
      redirect: 'if_required'
    }).subscribe({
      next: (result) => {
        if (result.error) {
          this.errorMessage.set(result.error.message || 'Payment failed.');
        } else if (result.paymentIntent?.status === 'succeeded') {
          // this.cartService.clearCart().subscribe();  // clear the cart after successful payment
          this.router.navigate(['/checkout/success']);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('confirm payment error', err);
        this.errorMessage.set('An unexpected error occurred.');
        this.isLoading.set(false);
      }
    });
  }
}