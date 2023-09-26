import { Injectable, Logger } from '@nestjs/common';
import { User } from '../schema/user.schema';

import {
  SignUpDetails,
  LookUpUserParams,
  AddContactParams,
} from '../dtos/types';
import { IUserService } from '../interfaces/user.interface';
import { UserAlreadyExists } from 'src/exceptions/UserAlreadyExists';
import { UserNotFoundException } from 'src/exceptions/UserNotFound';
import { ContactAlreadyExists } from 'src/exceptions/ContactAlreadyExists';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async signUp(userDetails: SignUpDetails): Promise<User> {
    this.logger.log(`Signing up user ${userDetails.username}`);
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: userDetails.username }, { email: userDetails.email }],
      },
    });
    if (existingUser) {
      this.logger.error(`User ${userDetails.username} already exists`);
      throw new UserAlreadyExists();
    }
    const params = { ...userDetails };
    return await this.prisma.user.create({
      data: params,
    });
  }

  async findUsers(query: string): Promise<User[] | []> {
    this.logger.log(`Searching for users with query ${query}`);
    return await this.prisma.user.findMany({
      where: {
        title: { contains: query },
      },
      take: 10,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async lookUpUser(findUserParams: LookUpUserParams): Promise<User> {
    this.logger.log(`Looking up user ${JSON.stringify(findUserParams)}`);
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: findUserParams.id },
          { email: findUserParams.email },
          { username: findUserParams.username },
        ],
      },
    });
    if (!user) {
      this.logger.error(`User ${JSON.stringify(findUserParams)} not found`);
      throw new UserNotFoundException();
    }
    return user;
  }

  async addContact(addContactParams: AddContactParams): Promise<User> {
    this.logger.log(`Adding contact ${JSON.stringify(addContactParams)}`);

    const user = this.prisma.user.findUnique({
      where: { id: addContactParams.userId },
    });

    if (!user) {
      this.logger.error(`User ${addContactParams.userId} not found`);
      throw new UserNotFoundException();
    }

    const contact = await this.prisma.contact.findUnique({
      where: {
        userId_contactId: {
          userId: addContactParams.userId,
          contactId: addContactParams.contactId,
        },
      },
    });

    if (contact) {
      this.logger.error(`Contact ${addContactParams.contactId} already exists`);
      throw new ContactAlreadyExists();
    }

    await this.prisma.contact.create({
      data: {
        contactId: addContactParams.contactId,
        userId: addContactParams.userId,
      },
    });

    return user;
  }
}
