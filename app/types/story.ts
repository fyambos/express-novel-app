export interface Story {
    _id: string;
    title: string;
    summary: string;
    genres: string[];
    rating: string;
    tags: string[];
    createdAt: Date;
    author: {
      _id: string;
      id: string;
      username: string;
      email: string;
      bio: string;
  },
  }