import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from 'src/schemas/User';
import { anything } from 'ts-mockito';

import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';

describe('AuthService', () => {
    // const mockCreateUser: Required<CreateUserDto> = {
    //     email: 'test212221ww@test.com',
    //     name: 'test',
    //     password: '!@#qwe123',
    //     profile: '',
    //     phone: '',
    // };
    let service: AuthService;
    let userRepository: AuthRepository;

    // const mockUser = userModel: Model<User>
    // mockUser.name = 'test';

    const mockAuthRepository = {
        findByEmailUser: jest.fn().mockImplementation((email) => {
            return { email: email, ...mockUser };
        }),
        findByNameUser: jest.fn().mockImplementation((name) => User),
        createUser: jest.fn().mockImplementation((dto) => User),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                AuthRepository,
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('registers success ', async () => {
        const mockCreateUser: Required<CreateUserDto> = {
            email: 'test212221ww@test.com',
            name: 'test',
            password: '!@#qwe123',
            profile: '',
            phone: '',
        };

        expect(await service.registerUser(mockCreateUser)).toEqual({
            success: true,
        });
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
