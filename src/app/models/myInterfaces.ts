import { Instance } from 'simple-peer';

export interface PeerData {
    id: string;
    data: any;
  }
  
  export interface UserInfo {
    userName: string;
    connectionId: string;
  }
  
  export interface SignalInfo {
    user: string;
    signal: any;
  }
  export interface ChatMessage {
    own: boolean;
    message: string;
  }
  export class SingleOne{
    constructor(current,client){
      this.current=current;
      this.client=client;
    }
    current:Instance;
    client:string
  }