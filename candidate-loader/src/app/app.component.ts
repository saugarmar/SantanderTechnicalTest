import { Component } from '@angular/core';
import { CandidateFormComponent } from './components/candidate-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CandidateFormComponent],
  template: '<app-candidate-form></app-candidate-form>'
})
export class AppComponent {
  title = 'candidate-loader';
}
