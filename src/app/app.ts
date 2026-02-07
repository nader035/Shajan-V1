import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatArea } from './components/chat-area/chat-area';
import { CardPreview } from './components/card-preview/card-preview';
import { NavbarComponent } from './components/shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatArea, CardPreview, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('shajan');
}
