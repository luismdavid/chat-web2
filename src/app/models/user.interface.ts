import { DocumentReference } from '@angular/fire/firestore';
import { ChatModel } from './chat.interface';

export interface User {
    id?: string;
    email?: string;
    username: string;
    chats: { ref: DocumentReference; user: DocumentReference }[]
}
