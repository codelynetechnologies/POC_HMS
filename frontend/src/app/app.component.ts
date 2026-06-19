import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <div class="app-header__brand">
        <span class="app-header__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z" />
          </svg>
        </span>
        <div>
          <div class="app-header__title">{{ appName }}</div>
          <div class="app-header__subtitle">Patient Registration</div>
        </div>
      </div>
      <div class="app-header__meta">
        <div class="app-header__user">
          <div class="app-header__user-name">Front Desk</div>
          <div class="app-header__user-role">Registration Terminal 01</div>
        </div>
        <span class="app-header__env">{{ companyName }}</span>
      </div>
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
        height: var(--app-header-h);
        background: linear-gradient(90deg, var(--hms-primary-dark), var(--hms-primary));
        color: #fff;
        padding: 0 24px;
        box-shadow: var(--hms-shadow);
        position: sticky;
        top: 0;
        z-index: 20;
      }
      .app-header__brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .app-header__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        background: rgba(255, 255, 255, 0.16);
        border-radius: var(--hms-radius);
      }
      .app-header__logo svg {
        width: 20px;
        height: 20px;
      }
      .app-header__title {
        font-size: 15px;
        font-weight: 600;
      }
      .app-header__subtitle {
        font-size: 12px;
        opacity: 0.85;
      }
      .app-header__meta {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .app-header__user {
        text-align: right;
        line-height: 1.3;
      }
      .app-header__user-name {
        font-size: 13px;
        font-weight: 600;
      }
      .app-header__user-role {
        font-size: 11px;
        opacity: 0.8;
      }
      .app-header__env {
        font-size: 12px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.16);
        padding: 4px 12px;
        border-radius: 999px;
      }
      @media (max-width: 560px) {
        .app-header__user {
          display: none;
        }
      }
      .app-main {
        padding: 20px;
        max-width: 1180px;
        margin: 0 auto;
      }
    `,
  ],
})
export class AppComponent {
  readonly appName = environment.appName;
  readonly companyName = environment.companyName;
}
