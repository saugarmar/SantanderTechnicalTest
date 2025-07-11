import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CandidateFormComponent } from './candidate-form.component';
import { CandidateService } from './candidate-form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Candidate } from 'src/assets/models/candidate-model';
import { expect } from '@jest/globals';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;
  let candidateServiceMock: any;

  beforeEach(async () => {
    candidateServiceMock = {
      uploadCandidate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        CandidateFormComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CandidateService, useValue: candidateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should update form value on file change', () => {
    const fakeFile = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [fakeFile] } };

    component.onFileChange(event as any);

    expect(component.form.get('file')!.value).toBe(fakeFile);
  });

  it('should call uploadCandidate on submit with valid form', fakeAsync(() => {
    // Prepare form
    component.form.patchValue({
      name: 'John',
      surname: 'Doe',
      file: new File([''], 'file.txt')
    });

    // Mock the native file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    const testFile = new File([''], 'file.txt');
    Object.defineProperty(fileInput, 'files', {
      value: [testFile]
    });
    component.fileInput = { nativeElement: fileInput } as any;

    const candidate: Candidate = { name: 'John', surname: 'Doe', seniority: 'senior', years: 0, availability: true };
    candidateServiceMock.uploadCandidate.mockReturnValue(of(candidate));

    component.onSubmit();
    tick();

    expect(candidateServiceMock.uploadCandidate).toHaveBeenCalledWith('John', 'Doe', testFile);
    expect(component.candidates).toContain(candidate);
    expect(component.form.value.name).toBeNull(); // after reset, form controls reset to null
    expect(component.fileInput.nativeElement.value).toBe('');
  }));

});
