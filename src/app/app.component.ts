import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'novel-app';

  ngOnInit() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.applyDarkTheme();
    } else {
      this.removeDarkTheme();
    }
  }
  applyDarkTheme() {
    document.body.classList.add('dark');
  }
  removeDarkTheme() {
    document.body.classList.remove('dark');
  }
}
