import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <div class="app-header__brand">
        <span class="app-header__logo">HMS</span>
        <div>
          <div class="app-header__title">Hospital Management System</div>
          <div class="app-header__subtitle">Patient Registration</div>
        </div>
      </div>
      <div class="app-header__env">Migration POC</div>
    </header>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--hms-primary-dark);
        color: #fff;
        padding: 10px 24px;
        box-shadow: var(--hms-shadow);
        position: sticky;
        top: 0;
        z-index: 20;
      }
      .app-header__brand {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .app-header__logo {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 1px;
        background: rgba(255, 255, 255, 0.15);
        padding: 6px 12px;
        border-radius: var(--hms-radius);
      }
      .app-header__title {
        font-size: 15px;
        font-weight: 600;
      }
      .app-header__subtitle {
        font-size: 12px;
        opacity: 0.8;
      }
      .app-header__env {
        font-size: 12px;
        font-weight: 600;
        background: var(--hms-accent);
        padding: 4px 12px;
        border-radius: 999px;
      }
      .app-main {
        padding: 20px;
        max-width: 1180px;
        margin: 0 auto;
      }
    `,
  ],
})
export class AppComponent {}
