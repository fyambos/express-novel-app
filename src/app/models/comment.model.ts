export interface Comment {
    id: string;
    authorId: string;
    chapterId: string;
    text: string;
    replyTo: string | null;
    replies?: Comment[];
    author?: any;
    createdAt?: string;
    likes?: string[];
}
  
  