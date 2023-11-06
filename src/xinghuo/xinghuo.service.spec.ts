import { Test, TestingModule } from '@nestjs/testing';
import { XinghuoService } from './xinghuo.service';

describe('XinghuoService', () => {
  let service: XinghuoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XinghuoService],
    }).compile();

    service = module.get<XinghuoService>(XinghuoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
