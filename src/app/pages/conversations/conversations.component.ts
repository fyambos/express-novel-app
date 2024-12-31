import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Conversation } from 'src/app/models/conversation.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
})
export class ConversationsComponent implements OnInit {
  currentUserId: string = '';
  conversations: Conversation[] = [];

  constructor(
    private messageService: MessageService,
    private auth: Auth,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadConversations();
      }
    });
    this.route.paramMap.subscribe(() => {
      this.loadConversations();
    });
  }

  loadConversations(): void {
    if (this.currentUserId) {
      this.messageService.getConversations(this.currentUserId)
        .then((conversations: Conversation[]) => {
          this.conversations = conversations;
        })
        .catch((error) => {
          console.error('Error fetching conversations:', error);
        });
    }
  }
}
