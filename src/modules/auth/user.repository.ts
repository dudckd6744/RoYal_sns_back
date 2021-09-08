import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.create.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const { name, email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hash_password = await bcrypt.hash(password, salt);

    const user = await this.create({
      type: '',
      name,
      email,
      password: hash_password,
    });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY')
        throw new ConflictException('이미 해당 유저가 존재합니다.');
    }

    return { message: 'Success' };
  }
}
