import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IUserService } from '../interfaces/user.interface';
import { AddContactParams, SignUpDetails } from '../dtos/types';
import { User } from '../entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject(UserService.name) private readonly userService: IUserService,
  ) {}

  @Get()
  async hello() {
    return 'Hello from user controller';
  }

  @Get('search')
  searchUsers(@Query('query') query: string) {
    this.logger.log(`Received search request for ${query}`);
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
    return this.userService.findUsers(query);
  }

  @Get('lookup')
  lookUpUser(@Query() findUserParams: Partial<User>): Promise<User> {
    this.logger.log(
      `Received lookup request for ${JSON.stringify(findUserParams)}`,
    );
    if (!findUserParams)
      throw new HttpException(
        'Provide a valid user to look up',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.lookUpUser(findUserParams);
  }

  @Patch('contacts')
  addContact(@Body() addContactParams: AddContactParams): Promise<User> {
    this.logger.log(
      `Received add contact request for ${JSON.stringify(addContactParams)}`,
    );
    if (!addContactParams)
      throw new HttpException(
        'Provide a valid contact to add',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.addContact(addContactParams);
  }

  @Post('signup')
  signUp(@Body() userDetails: SignUpDetails): Promise<User> {
    this.logger.log(`Received sign up request for ${userDetails.username}`);
    if (!userDetails)
      throw new HttpException(
        'Provide a valid user to sign up',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.signUp(userDetails);
  }
}
