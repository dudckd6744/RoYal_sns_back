import { BadRequestException } from '@nestjs/common';
import { errStatus, Success } from 'src/resStatusDto/resStatus.dto';
import { User } from 'src/schemas/User';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { AuthModule } from './auth.module';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';

describe('AuthService', () => {
    let mockedRepository: AuthRepository;

    beforeEach(async () => {
        mockedRepository = mock(AuthRepository);
    });

    it('register s ', async () => {
        const mockCreateUser = {
            email: 'test212221ww@test.com',
            name: '',
            password: 'a!',
            profile: '',
            phone: '',
        };

        const saveUser = mockedRepository.createUser(
            mockCreateUser as CreateUserDto,
        );

        when(
            mockedRepository.findByEmailUser((await saveUser).email),
        ).thenReject(new BadRequestException('이미 해당 이메일이 존재합니다.'));

        when(mockedRepository.findByNameUser((await saveUser).name)).thenReject(
            new BadRequestException('이미 해당 이름이 존재합니다.'),
        );

        const sut = new AuthService(instance(mockedRepository));

        expect(await sut.registerUser(mockCreateUser)).toEqual({
            success: true,
        });
    });
});
