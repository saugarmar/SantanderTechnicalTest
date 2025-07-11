import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from 'src/assets/models/candidate-model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = 'http://localhost:3000/candidates/upload'; // Adjust your backend URL

  constructor(private http: HttpClient) {}

  uploadCandidate(
    name: string,
    surname: string,
    file: File
  ): Observable<Candidate> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('excel', file, file.name);

    return this.http.post<Candidate>(this.apiUrl, formData);
  }
}
