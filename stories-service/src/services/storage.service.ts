import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

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
      this.logger.error(
        "Erreur lors de la génération de l'URL signée :",
        error,
      );
      throw error;
    }
  }

  async uploadFile(
    bucketName: string,
    originalname: string,
    buffer: Buffer,
  ): Promise<void> {
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
