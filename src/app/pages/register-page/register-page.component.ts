import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  form: FormGroup;
  passwordHide: boolean = false;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(16),
      ]),
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
    this.authService.registerWithEmailAndPass(this.form.value).subscribe(() => {
      this.toast.show('Te has registrado con exito.');
      this.loading = false;
    }, err => {
      this.toast.show('Ha ocurrido un error.');
      this.loading = false;
    });
  }
}
