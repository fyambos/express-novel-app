export interface Comment {
    id: number;
    author: string;
    text: string;
    replyTo: number | null;
    replies?: Comment[];
}
  
  