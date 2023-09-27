import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly storage;

  constructor() {
    this.storage = new Storage();
  }
  async uploadFile(bucketName: string, originalname: string, buffer: Buffer): Promise<void> {
    const bucket = this.storage.bucket(bucketName);

    const blob = bucket.file(originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error(err);
        reject(err);
      });

      blobStream.on('finish', () => {
        console.log(`Fichier ${originalname} uploadé avec succès.`);
        resolve();
      });

      blobStream.end(buffer);
    });
  }
}
