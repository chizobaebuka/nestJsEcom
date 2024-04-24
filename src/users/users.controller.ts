import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { currentUser } from 'src/utils/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userSignUpDto: UserSignupDto): Promise<UserEntity> {
    return await this.usersService.signup(userSignUpDto);
  }

  @Post('signin')
  async signIn(@Body() userSignInDto: UserSignInDto): Promise<{
    user: UserEntity;
    accessToken: string;
  }> {
    const user = await this.usersService.signIn(userSignInDto);
    const accessToken = await this.usersService.generateAccessToken(user);

    return {
      user: user,
      accessToken: accessToken,
    };
  }

  @Post()
  create(@Body() body: any) {
    // return this.usersService.create(createUserDto);
    console.log(body);
    return 'hi';
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@currentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    // return this.usersService.update(+id, updateUserDto);
    console.log('zzz', id);
    console.log('www', body);
    return 'hi';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
