import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  passwordHide: boolean = false;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.maxLength(100),
        Validators.minLength(6),
        Validators.required,
      ]),
    });
  }

  submitForm() {
    this.loading = true;
    this.authService.loginWithEmailAndPass(this.form.value).subscribe(
      (user) => {
        this.toast.show('Bienvenido.');
        this.router.navigate(['/chats']);
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }
}
