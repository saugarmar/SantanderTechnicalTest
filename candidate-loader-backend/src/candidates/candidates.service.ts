import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

type Seniority = 'junior' | 'senior';

interface ParsedCandidateData {
  seniority: Seniority;
  years: number;
  availability: boolean;
}

@Injectable()
export class CandidatesService {

  parseExcel(buffer: Buffer): ParsedCandidateData {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: ['Seniority', 'Years of experience', 'Availability'], // manual headers
      range: 0,  // start from the first row (since there are no headers)
    });

    if (rows.length === 0) {
      throw new Error('Excel file is empty');
    }

    const excelData: any = rows[0];

    return {
      seniority: this.validateSeniority(excelData['Seniority']),
      years: this.validateYears(excelData['Years of experience']),
      availability: this.validateAvailability(excelData['Availability']),
    };
  }

  validateSeniority(value: any): Seniority {
    if (value === 'junior' || value === 'senior') {
      return value;
    }
    throw new Error(`Invalid seniority value: ${value}. Must be "junior" or "senior".`);
  }

  validateYears(value: any): number {
    const n = Number(value);
    if (!isNaN(n)) {
      return n;
    }
    throw new Error(`Invalid years of experience: ${value}. Must be a number.`);
  }

  validateAvailability(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new Error(`Invalid availability value: ${value}. Must be boolean or "true"/"false" string.`);
  }

}
