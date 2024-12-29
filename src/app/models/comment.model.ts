export interface Comment {
    id: number;
    authorId: string;
    chapterId: string;
    text: string;
    replyTo: number | null;
    replies?: Comment[];
    author?: any;
}
  
  