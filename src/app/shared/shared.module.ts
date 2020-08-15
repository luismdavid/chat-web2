import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  NbSidebarModule,
  NbLayoutModule,
  NbSidebarService,
  NbSearchModule,
  NbCardModule,
  NbUserModule,
  NbSearchService,
  NbChatModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    NbSidebarModule,
    NbLayoutModule,
    NbSearchModule,
    NbCardModule,
    NbUserModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,
    NbSpinnerModule
  ],
  providers: [MatIconRegistry, NbSidebarService, NbSearchService],
})
export class SharedModule {}
