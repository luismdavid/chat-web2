import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ChatMiniComponent } from './chat-page/chat-mini/chat-mini.component';
import { ChatComponent } from './chat-page/chat/chat.component';

@NgModule({
  declarations: [
    ChatPageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    ChatMiniComponent,
    ChatComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [],
})
export class PagesModule {}
