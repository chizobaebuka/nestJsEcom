import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto: UserSignupDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, 10);

    let user = this.userRepository.create(userSignUpDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signIn(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatch = await bcrypt.compare(
      userSignInDto.password,
      userExists.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Invalid password');
    }

    delete userExists.password;

    return userExists;
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRE_TIME },
    );
  }
  create() {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email });
  }
}
