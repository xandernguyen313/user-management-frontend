import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>User Management System</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    header {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h1 {
      margin: 0;
      color: #333;
      text-align: center;
      font-size: 28px;
    }

    main {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'user-management';
}