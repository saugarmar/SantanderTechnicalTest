import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidateService } from './candidate-form.service';
import { Candidate } from 'src/assets/models/candidate-model';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CandidateService],
    });

    service = TestBed.inject(CandidateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send POST request with correct FormData', () => {
    const dummyCandidate: Candidate = {
      name: 'Mr',
      surname: 'Pringles',
      seniority: 'junior',
      years: 5,
      availability: false
    };

    const file = new File(['file contents'], 'resume.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const name = 'John';
    const surname = 'Doe';

    service.uploadCandidate(name, surname, file).subscribe((res) => {
      expect(res).toEqual(dummyCandidate);
    });

    // Expect one POST request to the correct URL
    const req = httpMock.expectOne('http://localhost:3000/candidates/upload');
    expect(req.request.method).toBe('POST');

    // The body should be FormData with correct keys and values
    expect(req.request.body.get('name')).toBe(name);
    expect(req.request.body.get('surname')).toBe(surname);
    expect(req.request.body.has('name')).toBe(true);
    expect(req.request.body.has('surname')).toBe(true);
    expect(req.request.body.has('excel')).toBe(true);

    const sentFile = req.request.body.get('excel') as File;
    expect(sentFile.name).toBe(file.name);

    // Respond with dummy candidate
    req.flush(dummyCandidate);
  });
});
