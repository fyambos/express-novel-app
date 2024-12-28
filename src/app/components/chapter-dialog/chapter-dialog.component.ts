import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChapterService } from 'src/app/services/chapter.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-chapter-dialog',
  templateUrl: './chapter-dialog.component.html',
})
export class ChapterDialogComponent implements OnInit {
  title: string = '';
  content: string = '';
  storyId: string = '';
  isEditing: boolean = false;
  currentUser: User | null = null;

  constructor(
    public dialogRef: MatDialogRef<ChapterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chapterService: ChapterService,
    private router: Router,
    private auth: Auth
  ) {}

  async ngOnInit() {
    this.currentUser = this.auth.currentUser;

    if (!this.currentUser) {
      console.error('No authenticated user found');
      return;
    }

    if (this.data?.storyId) {
      this.storyId = this.data.storyId;
      console.log('Story ID:', this.storyId);
    }

    if (this.data?._id) {
      this.isEditing = true;
      await this.loadChapterDetails(this.data._id);
    }
  }

  async loadChapterDetails(chapterId: string) {
    try {
      const chapter = await this.chapterService.getChapterById(chapterId);
      if (chapter) {
        this.title = chapter.title || '';
        this.content = chapter.content || '';
        this.storyId = chapter.storyId || '';
      }
    } catch (error) {
      console.error('Error fetching chapter:', error);
    }
  }

applyFormatting(command: string) {
  const contentEditableDiv = document.getElementById('content') as HTMLElement;

  if (contentEditableDiv && document.getSelection()) {
    if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
      this.applyTextAlignment(command);
    } else {
      this.applyCommand(command);
    }
  }
}

applyTextAlignment(command: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.extractContents();
  
  const wrapper = document.createElement('div'); 
  wrapper.style.display = 'block';
  
  switch (command) {
    case 'justifyLeft':
      wrapper.style.textAlign = 'left';
      break;
    case 'justifyCenter':
      wrapper.style.textAlign = 'center';
      break;
    case 'justifyRight':
      wrapper.style.textAlign = 'right';
      break;
    default:
      break;
  }
  // wraps selected text in new element and 
  wrapper.appendChild(selectedText);
  range.insertNode(wrapper);
  const selectionRange = document.createRange();
  selectionRange.setStartAfter(wrapper); // moves the cursor after the wrapped content
  selectionRange.setEndAfter(wrapper);
  selection.removeAllRanges();
  selection.addRange(selectionRange);
}

applyCommand(command: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.cssText = this.getCommandStyle(command);
  range.surroundContents(span);
}

getCommandStyle(command: string): string {
  switch (command) {
    case 'bold':
      return 'font-weight: bold;';
    case 'italic':
      return 'font-style: italic;';
    case 'underline':
      return 'text-decoration: underline;';
    default:
      return '';
  }
}

async onSubmit() {
  if (!this.currentUser) {
    console.error('Cannot submit chapter without an authenticated user');
    return;
  }

  const contentEditableDiv = document.getElementById('content') as HTMLElement;
  const formattedContent = contentEditableDiv ? contentEditableDiv.innerHTML : '';

  const chapter = {
    title: this.title,
    content: formattedContent,
    storyId: this.storyId,
    authorId: this.currentUser.uid,
  };

  try {
    if (this.isEditing) {
      const updatedChapter = await this.updateChapter(this.data._id, chapter);
      this.dialogRef.close(updatedChapter);
      if (updatedChapter && updatedChapter._id) {
        this.router.navigate([`/chapters/${updatedChapter._id}`]);
      }
    } else {
      const newChapter = await this.createChapter(chapter);
      this.dialogRef.close(newChapter);
      if (newChapter && newChapter._id) {
        this.router.navigate([`/chapters/${newChapter._id}`]);
      }
    }
  } catch (error) {
    console.error('Error submitting chapter:', error);
  }
}


  async createChapter(chapter: any) {
    try {
      const newChapter = await this.chapterService.createChapter(chapter);
      return newChapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw error;
    }
  }

  async updateChapter(chapterId: string, chapter: any) {
    try {
      const updatedChapter = await this.chapterService.editChapter(chapterId, chapter);
      return updatedChapter;
    } catch (error) {
      console.error('Error updating chapter:', error);
      throw error;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
