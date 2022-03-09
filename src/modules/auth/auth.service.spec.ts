import { errStatus, Success } from 'src/resStatusDto/resStatus.dto';
import { mock } from 'ts-mockito';

import { AuthModule } from './auth.module';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let mockedRepository: AuthRepository;

    beforeEach(async () => {
        mockedRepository = mock(AuthRepository);
    });

    it('register ', async () => {});
});
