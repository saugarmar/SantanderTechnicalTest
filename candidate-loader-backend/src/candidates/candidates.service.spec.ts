import { CandidatesService } from './candidates.service';
import * as XLSX from 'xlsx';

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(() => {
    service = new CandidatesService();
  });

  describe('parseExcel', () => {
    it('should parse valid Excel buffer correctly', () => {
      const data = [
        ['junior', 3, true],
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const result = service.parseExcel(buffer);

      expect(result).toEqual({
        seniority: 'junior',
        years: 3,
        availability: true,
      });
    });

    it('should throw error if Excel is empty', () => {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([]), 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      expect(() => service.parseExcel(buffer)).toThrow('Excel file is empty');
    });
  });

  describe('validateSeniority', () => {
    it('should return valid seniority', () => {
      expect(service.validateSeniority('junior')).toBe('junior');
      expect(service.validateSeniority('senior')).toBe('senior');
    });

    it('should throw on invalid seniority', () => {
      expect(() => service.validateSeniority('mid')).toThrow('Invalid seniority value: mid. Must be "junior" or "senior".');
    });
  });

  describe('validateYears', () => {
    it('should parse numeric years', () => {
      expect(service.validateYears(5)).toBe(5);
      expect(service.validateYears('10')).toBe(10);
    });

    it('should throw on invalid years', () => {
      expect(() => service.validateYears('five')).toThrow('Invalid years of experience: five. Must be a number.');
      expect(() => service.validateYears(undefined)).toThrow('Invalid years of experience: undefined. Must be a number.');
    });
  });

  describe('validateAvailability', () => {
    it('should parse boolean or string correctly', () => {
      expect(service.validateAvailability(true)).toBe(true);
      expect(service.validateAvailability(false)).toBe(false);
      expect(service.validateAvailability('true')).toBe(true);
      expect(service.validateAvailability('false')).toBe(false);
    });

    it('should throw on invalid availability', () => {
      expect(() => service.validateAvailability('yes')).toThrow('Invalid availability value: yes. Must be boolean or "true"/"false" string.');
      expect(() => service.validateAvailability(null)).toThrow('Invalid availability value: null. Must be boolean or "true"/"false" string.');
    });
  });
});
