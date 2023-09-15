import { MessageType } from "./chatbot";

export interface IAuthStore {
    isAuth: boolean;
    user: {
        id: number;
        role: string;
        firstname?: string;
        lastname?: string;
        email: string;
    };
    loading: boolean;
}

export interface IChatbotStore {
    chatMessageFromSide: string;
    messageList: MessageType[];
    extractedTextFromFile: string | null;
}