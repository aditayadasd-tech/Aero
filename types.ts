
export enum Role {
  USER = 'user',
  AERON = 'model'
}

export interface Message {
  role: Role;
  content: string;
  id: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface CharacterConfig {
  name: string;
  personality: string;
  style: string;
  background: string;
  relationship: string;
}
