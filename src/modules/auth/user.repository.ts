import { BadRequestException, ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto, PasswordUserDto } from './dto/user.create.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const { name, email, password,profile } = createUserDto;

    const image = profile ? profile : null

    const salt = await bcrypt.genSalt();
    const hash_password = await bcrypt.hash(password, salt);

    const user = await this.create({
      type: '',
      name,
      email,
      password: hash_password,
      profile:image
    });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY')
        throw new ConflictException('이미 해당 유저가 존재합니다.');
    }

    return { message: 'Success' };
  }

  async passwordUpdateUser(
      user: User,
      passwordUserDto : PasswordUserDto
  ): Promise<{message: string}> {
    const { password, new_password, confirm_new_password} = passwordUserDto;

    if(new_password != confirm_new_password) throw new BadRequestException('다시 한번 비밀번호를 확인해주세요!')

    const user_data = await this.findOne({email:user.email});

    if (await bcrypt.compare(password, user_data.password)) {
        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(new_password, salt);

        user_data.password = hash_password
        await this.save(user_data)
    }else{
        throw new BadRequestException('기존에 있던 비밀번호를 다시 입력해주세요')
    }
    return {message: "suucess"}
    }
}
