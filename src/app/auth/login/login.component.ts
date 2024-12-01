import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AppState } from '../../state/app.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading: boolean = false;
  formGroup: FormGroup;
  hide: boolean = true;

  constructor(
    private $service: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private $state: AppState,
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  get disabled(): boolean {
    return this.loading || this.formGroup.invalid;
  }

  loginAsAdmin(): void {
    this.loading = true;
    const form = this.formGroup;
    this.$service.login(form.value).subscribe({
      next: (response) => {
        console.log('as admin',response);
        
        const { user, token } = response;
        console.log('user',user);
        
        this.$state.setState({ user, token });
        sessionStorage.setItem('collision-detection-user-info', token);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error.message);
        if (err.error.message === "Reset required") {
          this.router.navigate(['/forgot-password']);
        }
      },
      complete: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
