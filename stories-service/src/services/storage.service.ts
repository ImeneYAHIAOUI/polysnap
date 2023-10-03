import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import {FileNotFoundException } from '../exceptions/file-not-found.exception';
import { UsersProxyService } from './users-service-proxy/user-service-proxy.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly usersProxyService: UsersProxyService;
  private readonly storage;

  constructor() {
    this.storage = new Storage();
  }
  async generate(fileName: string): Promise<string> {
    try {
      const options = {
        version: 'v4' as const,
        action: 'write' as const,
        expires: Date.now() + 15 * 60 * 1000,
        contentType: 'application/octet-stream',
      };
      const [url] = await this.storage
        .bucket('story-bucket')
        .file(fileName)
        .getSignedUrl(options);

      this.logger.log('URL de téléversement signée PUT générée :');
      this.logger.log(url);
      this.logger.log(
        "Vous pouvez utiliser cette URL avec n'importe quel agent utilisateur, par exemple :",
      );
      this.logger.log(
        "curl -X PUT -H 'Content-Type: application/octet-stream' " +
          `--upload-file mon-fichier '${url}'`,
      );
      return url;
    } catch (error) {
      throw error;
    }
  }
  async download(fileName: string,viewerId: string, publisherId : string): Promise<{ content: Buffer, url: string }> {
        const contacts = await this.usersProxyService.getContactOfUser(publisherId);
        if (!contacts.some(contact => contact.userId.toString() === viewerId)) {
            throw new UnauthorizedException(`The user ${viewerId} is not authorized to access the file ${fileName}.`);
        }
       const file = this.storage.bucket(process.env.BUCKET_NAME).file(fileName);
        const [exists] = await file.exists();
        if (!exists) {
            throw new FileNotFoundException(`Le fichier ${fileName} n'existe pas.`);
        }
       const [fileContent] = await file.download();
       const url = `https://storage.google.com/${process.env.BUCKET_NAME}/${fileName}`;
       return { content: fileContent, url: url };
  }
  async uploadFile(
    bucketName: string,
    originalname: string,
    buffer: Buffer,
  ): Promise<void> {
    const bucket = this.storage.bucket(bucketName);
   }







}
