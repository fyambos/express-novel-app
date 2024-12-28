import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  createChapter(chapter: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/chapters`, chapter);
  }

  getChapterById(chapterId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/chapters/${chapterId}`);
  }

  editChapter(chapterId: string, chapter: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/chapters/${chapterId}`, chapter);
  }

  deleteChapter(chapterId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/chapters/${chapterId}`);
  }

  getChaptersByStoryId(storyId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stories/${storyId}/chapters`);
  }
}
