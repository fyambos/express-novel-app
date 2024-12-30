import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private userService: UserService,

  ) {}

  async getStoryById(storyId: string) {
    try {
      const story = await lastValueFrom(this.http.get<any>(`${this.apiUrl}/stories/${storyId}`));
      const author = await this.userService.fetchUser(story.author);
      return { ...story, author };
    } catch (error) {
      console.error('Error fetching story and author:', error);
      throw error;
    }
  }

  async createStory(story: any) {
    try {
      const newStory = await lastValueFrom(this.http.post<any>(`${this.apiUrl}/create`, story));
      return newStory;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  }

  async editStory(storyId: string, story: any) {
    try {
      const updatedStory = await lastValueFrom(this.http.put<any>(`${this.apiUrl}/stories/${storyId}/edit`, story));
      return updatedStory;
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  }

  async getAllStories() {
    try {
      const stories = await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/stories`));

      const storiesWithAuthors = await Promise.all(
        stories.map(async (story) => {
          const author = await this.userService.fetchUser(story.author);
          return { ...story, author };
        })
      );

      return storiesWithAuthors;
    } catch (error) {
      console.error('Error fetching stories and authors:', error);
      throw error;
    }
  }

  getChapterWordCount(chapter: any): number {
    if (!chapter || !chapter.content) {
      throw new Error('Invalid chapter object');
    }
    const content = chapter.content || '';
    const cleanedContent = this.stripHtmlTags(content);
    return this.countWords(cleanedContent);
  }

  getStoryWordCount(story: any): number {
    if (!story) {
      throw new Error('No story object provided');
    }
    if (!story.chapters || !story.chapters.length) {
      return 0;
    }
    return story.chapters.reduce((total: any, chapter: any) => {
      return total + this.getChapterWordCount(chapter);
    }, 0);
  }

  private countWords(text: string): number {
    if (!text.trim()) {
      return 0;
    }
    return text.trim().split(/\s+/).length;
  }
  
  private stripHtmlTags(text: string): string {
    const strippedText = text.replace(/<\/?(div|p|br|section|article|header|footer|h[1-6]|li|ul|ol|blockquote|pre)[^>]*>/gi, ' ');
    return strippedText.replace(/<[^>]*>/g, '').trim();
  }
}
