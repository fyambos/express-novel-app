import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
})
export class StoryCardComponent {
  @Input() story: any;

  constructor(
    private router: Router,
  ) {}

  readMore(storyId: string) {
    this.router.navigate([`/stories/${storyId}`]);
  }
}
