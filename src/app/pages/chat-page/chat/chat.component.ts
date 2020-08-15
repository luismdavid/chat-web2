import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { User } from 'src/app/models/user.interface';
import { Message } from '../../../models/message.interface';
import { tap, switchMap } from 'rxjs/operators';
import { ChatModel } from 'src/app/models/chat.interface';
import { empty, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chatUser: User;
  chat: ChatModel;
  private newChat: boolean;
  currentUser: User;
  messages: Message[] = [];
  loading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private messageService: MessageService,
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  sendMessageAction: (contents) => void;

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        tap((query) => {
          this.chatUser = this.chatService.otherUser;
          if (query.new) {
            this.sendMessageAction = this.initializeChat;
            this.newChat = true;
          } else {
            this.newChat = false;
            this.sendMessageAction = this.sendNewMessage;
          }
        }),
        switchMap(() => this.authService.getCurrentUser()),
        tap((user) => (this.currentUser = user)),
        switchMap(() => this.activatedRoute.params),
        switchMap((params) => {
          this.loading = true;
          if (this.newChat) {
            return of({
              id: params.id,
              user: this.firestore.doc(`users/` + this.chatUser.id).ref,
            } as ChatModel);
          } else {
            return this.chatService.getChatById(params.id);
          }
        }),
        switchMap((chat) => {
          this.chat = chat;
          return this.authService.getUserById(chat.user.id).pipe(
            tap((user) => (this.chatUser = user)),
            switchMap(() =>
              this.messageService.getMessagesByChat(this.chat.id)
            ),
            tap((messages) => {
              this.messages.push(...messages.filter(x => !this.messages.find(a => a.id === x.id)));
              this.messages = this.messages.sort((a, b) => a.date.getTime() - b.date.getTime());
              console.log(this.messages);
              this.loading = false;
            })
          );
        })
      )
      .subscribe();
  }

  initializeChat(contents: {
    files: { url: string; icon: string }[];
    message: string;
  }) {
    const message: Message = {
      id: uuid(),
      chat: this.firestore.doc(`chats/` + this.chat.id).ref,
      date: new Date(),
      sender: this.currentUser.username,
      text: contents.message,
      type: contents.files.length > 0 ? 'file' : 'text',
      user: this.currentUser.id,
    };
    this.chatService
      .createChat(this.chatUser, this.chat.id)
      .pipe(switchMap(() => this.messageService.createMessage(message)))
      .subscribe();
  }

  sendNewMessage(contents: {
    files: any[];
    message: string;
  }) {
    const message: Message = {
      id: uuid(),
      chat: this.firestore.doc(`chats/` + this.chat.id).ref,
      date: new Date(),
      sender: this.currentUser.username,
      text: contents.message,
      type: contents.files.length > 0 ? 'file' : 'text',
      user: this.currentUser.id,
    };
    console.log(contents.files);
    this.messageService.createMessage(message, contents.files).subscribe();
  }
}
