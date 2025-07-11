import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CandidateService } from './candidate-form.service';
import { Candidate } from 'src/assets/models/candidate-model';
import { Column } from 'src/assets/models/column-model';


@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent {
  form: FormGroup;
  candidates: Candidate[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  columns: Column[] = [
    {
      def: 'name',
      header: 'Name',
      cell: (c) => c.name,
    },
    {
      def: 'surname',
      header: 'Surname',
      cell: (c) => c.surname,
    },
    {
      def: 'seniority',
      header: 'Seniority',
      cell: (c) => c.seniority,
    },
    {
      def: 'years',
      header: 'Years',
      cell: (c) => c.years.toString(),
    },
    {
      def: 'availability',
      header: 'Available',
      cell: (c) => (c.availability ? 'Yes' : 'No'),
    },
  ];

  displayedColumns = this.columns.map(c => c.def);

  constructor(private fb: FormBuilder, private candidateService: CandidateService, private snackBar: MatSnackBar) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      file: [null, Validators.required]
    });

  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.form.patchValue({ file });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { name, surname } = this.form.value;
    const file: File = this.fileInput.nativeElement.files![0];

    this.candidateService.uploadCandidate(name, surname, file).subscribe({
      next: (candidate) => {
        this.candidates = [...this.candidates, candidate];
        this.form.reset();
        this.fileInput.nativeElement.value = '';
      },
      error: (err) => {
        console.log(`Error uploading candidate: ${err.error.message}`)
        this.snackBar.open(`Error uploading candidate: ${err.error.message}`, 'Close', {
          panelClass: 'snackbar-error'
        });
      }
    });
  }

}
