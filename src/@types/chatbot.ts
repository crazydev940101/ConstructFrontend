export interface MessageType {
    sender: SenderType;
    message: string;
}

export type SenderType = 0 | 1; // 0: user, 1: bot