/* eslint-disable prettier/prettier */
import {Controller, Post } from '@nestjs/common';
import { MessagesCleanUpService } from 'src/services/messagesCleanUp.service';


@Controller("messagesCleanUp")
export class MessageCleanupController {
    constructor(private messageCleanUp : MessagesCleanUpService) {}

    @Post()
    async cleanupMessages(  ) {
        // Implement your logic here to check and delete messages in Firestore
        // For example: 
        this.messageCleanUp.cleanUpMessages();
    }
}