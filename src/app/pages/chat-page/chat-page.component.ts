import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatModel } from 'src/app/models/chat.interface';
import { NbSidebarService } from '@nebular/theme';
import { Conversation } from 'src/app/models/conversation.interface';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
})
export class ChatPageComponent implements OnInit {
  chats: Conversation[] = [];
  loading: boolean = true;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getChatsByUser().subscribe((chats) => {
      this.loading = false;
      this.chats = chats;
    });
  }
}
