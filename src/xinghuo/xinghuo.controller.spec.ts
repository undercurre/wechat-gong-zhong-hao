import { Test, TestingModule } from '@nestjs/testing';
import { XinghuoController } from './xinghuo.controller';

describe('XinghuoController', () => {
  let controller: XinghuoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XinghuoController],
    }).compile();

    controller = module.get<XinghuoController>(XinghuoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
