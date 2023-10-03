export class FileNotFoundException extends Error {
  constructor(fileName: string) {
    super(`Le fichier ${fileName} n'a pas été trouvé.`);
    this.name = 'FileNotFoundException';
  }
}
