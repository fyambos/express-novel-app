import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { MessageService } from 'src/app/services/message.service';
import { onAuthStateChanged } from 'firebase/auth';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {
  recipientId: string = '';
  recipient: any = {};
  conversations: any[] = [];
  messages: any[] = [];
  currentUserId: string = '';
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private auth: Auth,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadMessages();
        this.loadConversations();
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.recipientId = params.get('recipientId') || '';
      this.loadRecipient(); 
      this.loadMessages();
    });
  }

  loadRecipient(): void {
    if (this.recipientId) {
      this.userService.fetchUser(this.recipientId).then(
        (userData) => {
          this.recipient = userData;
        }
      ).catch(
        (error) => {
          console.error('Error loading recipient:', error);
        }
      );
    }
  }

  async loadMessages(): Promise<void> {
    if (this.currentUserId && this.recipientId) {
      try {
        const messages = await this.messageService.getMessages(this.currentUserId, this.recipientId);
        this.messages = messages;
        await this.messageService.markMessagesAsRead(this.currentUserId, this.recipientId);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }

  async loadConversations(): Promise<void> {
    if (this.currentUserId) {
      try {
        this.conversations = await this.messageService.getConversations(this.currentUserId);
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim() && this.currentUserId && this.recipientId) {
      try {
        await this.messageService.sendMessage(this.currentUserId, this.recipientId, this.newMessage.trim());
        this.newMessage = '';
        await this.loadMessages(); // Reload messages after sending a new one
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  navigateToUserProfile(): void {
    this.router.navigate(['/profile', this.recipientId]);
  }
}
