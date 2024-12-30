import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../services/story.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  stories: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private storyService: StoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchStories();
  }

  async fetchStories() {
    try {
      this.stories = await this.storyService.getAllStories();
      this.isLoading = false;
    } catch (error) {
      this.errorMessage = 'Error fetching stories. Please try again later.';
      this.isLoading = false;
    }
  }

  readMore(storyId: string) {
    console.log(storyId);
    this.router.navigate([`/stories/${storyId}`]);
  }
}
