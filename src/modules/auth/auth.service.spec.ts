import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';

describe('TestService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
            imports: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', async () => {
        expect(typeof service.followUser).toBe('function');
    });
});
