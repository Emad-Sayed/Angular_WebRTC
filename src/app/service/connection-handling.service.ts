import { Injectable } from '@angular/core';
import { HubConnection,HubConnectionBuilder} from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { UserInfo, SignalInfo } from '../models/myInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ConnectionHandlingService {
  private hubConnection: HubConnection;

  private newPeer = new Subject<UserInfo>();
  public newPeer$ = this.newPeer.asObservable();
  
  private helloAnswer = new Subject<UserInfo>();
  public helloAnswer$ = this.helloAnswer.asObservable();
  
  private disconnectedPeer = new Subject<UserInfo>();
  public disconnectedPeer$ = this.disconnectedPeer.asObservable();
  
  private signal = new Subject<SignalInfo>();
  public signal$ = this.signal.asObservable();
  constructor() { }
  public async startConnection(currentUser: string): Promise<void> {

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:44300/signalrtc')
      .build();

    await this.hubConnection.start();
    console.log('Connection started');

    this.hubConnection.on('NewUserArrived', (data) => {
      this.newPeer.next(JSON.parse(data));
    });

    this.hubConnection.on('UserSaidHello', (data) => {
      this.helloAnswer.next(JSON.parse(data));
    });

    this.hubConnection.on('SendSignal', (user, signal) => {
      this.signal.next({ user, signal });
    });

    this.hubConnection.invoke('NewUser', currentUser);
  }
  public sendSignalToUser(signal: string, user: string) {
    this.hubConnection.invoke('SendSignal', signal, user);
  }
  
  public sayHello(userName: string, user: string): void {
    this.hubConnection.invoke('HelloUser', userName, user);
  }
}