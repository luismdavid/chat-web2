import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { User } from './models/user.interface';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NbSidebarService, NbSearchService } from '@nebular/theme';
import { tap, switchMap } from 'rxjs/operators';
import { ToastService } from './services/toast.service';
import { ChatService } from './services/chat.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'chat-app-luis';
  userOptions: any[] = [];
  autocompleteForm: FormGroup;
  currentUser: User;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private sidebarService: NbSidebarService,
    private searchService: NbSearchService,
    private toast: ToastService,
    private chatService: ChatService
  ) {}

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  ngOnInit() {
    this.searchUserSub();
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      if (!this.currentUser) {
        this.router.navigate(['/auth/login']);
      } else {
        this.router.navigate(['/chats'])
      }
    });
  }

  searchUserSub() {
    this.searchService
      .onSearchSubmit()
      .pipe(
        switchMap(({ term }) => this.authService.getUsersByUsername(term)),
        tap((user) => {
          if (!user) {
            this.toast.show('Usuario no existe.');
          } else if (this.currentUser.chats.find(x => x.ref.id === user.id)){
            this.chatService.otherUser = user;
            this.router.navigate(['./chats/contact/'+this.currentUser.chats.find(x => x.ref.id === user.id).ref.id]);
          } else {
            this.chatService.otherUser = user;
            this.router.navigate(['./chats/contact/'+ uuid()], {
              queryParams: {
                new: true
              }
            })
          }
        })
      )
      .subscribe();
  }
}
