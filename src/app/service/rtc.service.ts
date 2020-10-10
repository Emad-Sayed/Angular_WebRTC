import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserInfo, PeerData, SingleOne } from '../models/myInterfaces';
import { Instance } from 'simple-peer';
import * as SimplePeer from 'simple-peer';
import { debug } from 'console';

@Injectable({
  providedIn: 'root'
})
export class RtcService {
  public users: BehaviorSubject<Array<UserInfo>>;

  public onSignalToSend = new Subject<PeerData>();

  public onStream = new Subject<PeerData>();

  public onConnect = new Subject<PeerData>();


  public myPeers: SingleOne[] = [];

  constructor() {
    this.users = new BehaviorSubject([]);
  }
  public newUser(user: UserInfo): void {
    this.users.next([...this.users.getValue(), user]);
  }

  public disconnectedUser(user: UserInfo): void {
    const filteredUsers = this.users.getValue().filter(x => x.connectionId === user.connectionId);
    this.users.next(filteredUsers);
  }


  public createPeer(stream, userId: string, initiator: boolean) {
    let currentPeer = new SimplePeer({ initiator, stream });
    let singleOne = new SingleOne(currentPeer, userId);
    this.myPeers.push(singleOne);

    singleOne.current.on('signal', data => {
      const stringData = JSON.stringify(data);
      console.log("Signal Created", data)
      this.onSignalToSend.next({ id: userId, data: stringData });
    });

    singleOne.current.on('stream', data => {
      console.log('Stream Created', data);
      this.onStream.next({ id: userId, data });
    });
    return singleOne.current;
  }
  public signalPeer(userId: string, signal: string, stream: any) {
    let selectedPeer = this.myPeers.find(d => d.client == userId);
    debugger
    const signalObject = JSON.parse(signal);
    if (selectedPeer) {
      selectedPeer.current.signal(signalObject);
    } else {
      let currentPeer = this.createPeer(stream, userId, false);
      currentPeer.signal(signalObject);
    }
  }



  public sendMessage(message: string) {
    // this.currentPeer.send(message);
  }
}
