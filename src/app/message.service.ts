import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];
  constructor() { }


  add(message: string) {
    this.messages.push(message);
    setTimeout(() => {
      this.clear();
    }, 2000);
  }

  clear() {
    this.messages = [];
  }
}
