import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';
const logger = new Logger('UsersProxyService');

@Injectable()
export class UsersProxyService {
    private _baseUrl: string;
    private _usersServicePath='/users';
    constructor(private configService: ConfigService, private readonly httpService: HttpService) {
        const dependenciesConfig = this.configService.get<DependenciesConfig>('dependencies');
        this._baseUrl = `http://${dependenciesConfig.user_service_url}`;
    }
    

}