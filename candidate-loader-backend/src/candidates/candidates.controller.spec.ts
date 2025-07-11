import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { BadRequestException } from '@nestjs/common';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: {
            parseExcel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return combined data when uploadCandidate is called', () => {
    const mockFile = {
      buffer: Buffer.from('some file data'),
    } as Express.Multer.File;

    const mockBody = { name: 'John', surname: 'Doe' };

    const excelFields = { age: 30, position: 'Developer' };
    (service.parseExcel as jest.Mock).mockReturnValue(excelFields);

    const result = controller.uploadCandidate(mockFile, mockBody);

    expect(service.parseExcel).toHaveBeenCalledWith(mockFile.buffer);
    expect(result).toEqual({
      name: mockBody.name,
      surname: mockBody.surname,
      ...excelFields,
    });
  });

  it('should throw BadRequestException if service throws', () => {
    const mockFile = {
      buffer: Buffer.from('some file data'),
    } as Express.Multer.File;

    const mockBody = { name: 'Jane', surname: 'Smith' };

    (service.parseExcel as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid file format');
    });

    expect(() => controller.uploadCandidate(mockFile, mockBody)).toThrow(BadRequestException);
  });
});
