import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ChatComponent } from './pages/chat-page/chat/chat.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full'
  },
  {
    path: 'chats',
    component: ChatPageComponent,
    children: [
      {
        path: 'contact/:id',
        component: ChatComponent
      }
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        pathMatch: 'full',
        component: RegisterPageComponent
      },
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
