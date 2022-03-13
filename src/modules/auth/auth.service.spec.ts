import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/schemas/User';

import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    const mockAuthRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                AuthRepository,
                {
                    provide: getModelToken(User.name),
                    useFactory: () => mockAuthRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('registers success ', async () => {
        expect(service).toBeDefined();
    });

    // it('register 이메일 중복 err', async () => {
    //     const mockCreateUser: Required<CreateUserDto> = {
    //         email: 'test212221ww@test.com',
    //         name: 'test',
    //         password: '!@#qwe123',
    //         profile: '',
    //         phone: '',
    //     };

    // when(await mockedRepository.findByEmailUser(await mockCreateUser.email))
    //     .thenReturn(sutUser)
    //     .thenReject(
    //         new BadRequestException('이미 해당 이메일이 존재합니다.'),
    //     );

    // const sut = new AuthService(instance(mockedRepository));
    // const sutUser = await mockedRepository.createUser(mockCreateUser);

    // when(await sut.registerUser(mockCreateUser)).thenThrow(
    //     new BadRequestException('errStatus'),
    // );
    // const actual = () => {
    //     sut.registerUser(mockCreateUser).
    // };

    // expect(actual).toThrow(
    //     new BadRequestException('이미 해당 이메일이 존재합니다.'),
    // );
});
