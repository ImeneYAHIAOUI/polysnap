export class MessageDTO {
    chatId: string;
    sender: string;
    content: string; 
    attachment: {
      type: string,
      name: string,
      link: string,
    };
    expiring: boolean;
    expirationTime: number;
}


