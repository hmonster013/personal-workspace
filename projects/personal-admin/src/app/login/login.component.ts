import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs';
import { AuthenticationService } from 'personal-common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService
  ) { 
      // redirect to home if already logged in
      if (this.authenticationService.userValue) { 
          this.router.navigate(['/v1/auth/sign-in']);
      }
  }

  ngOnInit() {
      this.createForm();
  }

  onSubmit() {
      this.submitted = true;

      if (this.loginForm.invalid) {
          return;
      }

      this.error = '';
      this.loading = true;
      this.authenticationService.login(this.f['userName'].value, this.f['password'].value)
          .pipe(first())
          .subscribe({
              next: () => {
                  // get return url from route parameters or default to '/'
                  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                  this.router.navigate([returnUrl]);
              },
              error: error => {
                  this.error = error;
                  this.loading = false;
              }
          });
  }

  get f() { return this.loginForm.controls; }

  private createForm() {
    this.loginForm = new FormGroup({
        userName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });
  }
}
