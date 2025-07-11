import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('excel', {
      storage: memoryStorage(),
    }),
  )
  uploadCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; surname: string },
  ) {
    try {
      const excelFields = this.candidatesService.parseExcel(file.buffer);

      return {
        name: body.name,
        surname: body.surname,
        ...excelFields,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
