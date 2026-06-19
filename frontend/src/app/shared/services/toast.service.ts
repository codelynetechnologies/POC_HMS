import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _messages = new Subject<ToastMessage>();
  readonly messages$ = this._messages.asObservable();

  success(text: string): void {
    this._messages.next({ type: 'success', text });
  }

  error(text: string): void {
    this._messages.next({ type: 'error', text });
  }
}
