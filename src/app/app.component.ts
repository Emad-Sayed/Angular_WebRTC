import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage, UserInfo, SignalInfo, PeerData } from './models/myInterfaces';
import { RtcService } from './service/rtc.service';
import { ConnectionHandlingService } from './service/connection-handling.service';
import { ControlContainer } from '@angular/forms';
import { userInfo } from 'os';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RTC';
  @ViewChild('videoContainer', { static: false }) videoContainer: ElementRef;

  public subscriptions = new Subscription();

  private stream;

  public currentUser: string;

  public dataString: string;

  public userVideo: string;

  public messages: Array<ChatMessage>;

  public mediaError = (): void => { console.error(`Can't get user media`); };

  constructor(private renderer:Renderer2,private rtcService: RtcService, private signalR: ConnectionHandlingService) { }

  ngOnInit() {
    this.messages = new Array();

    this.subscriptions.add(this.signalR.newPeer$.subscribe((user: UserInfo) => {
      this.rtcService.newUser(user);
      this.signalR.sayHello(this.currentUser, user.connectionId);
    }));

    this.subscriptions.add(this.signalR.helloAnswer$.subscribe((user: UserInfo) => {
      this.rtcService.newUser(user);
    }));

    this.subscriptions.add(this.signalR.disconnectedPeer$.subscribe((user: UserInfo) => {
      this.rtcService.disconnectedUser(user);
    }));

    this.subscriptions.add(this.signalR.signal$.subscribe((signalData: SignalInfo) => {
      this.rtcService.signalPeer(signalData.user, signalData.signal, this.stream);
    }));

    this.subscriptions.add(this.rtcService.onSignalToSend.subscribe((data: PeerData) => {
      this.signalR.sendSignalToUser(data.data, data.id);
    }));


    this.subscriptions.add(this.rtcService.onStream.subscribe((data: PeerData) => {
      let newVideo=this.renderer.createElement('video');
      let newH3=this.renderer.createElement('H3') as HTMLElement;
      newH3.innerHTML=data.id;
      newVideo.srcObject = data.data;
      newVideo.hight = 240;
      newVideo.width = 320;
      newVideo.load();
      newVideo.play();
      this.renderer.appendChild(this.videoContainer.nativeElement,newH3);
      this.renderer.appendChild(this.videoContainer.nativeElement,newVideo);
    }));
  }


  public onUserSelected(userInfo: UserInfo) {
    this.rtcService.createPeer(this.stream, userInfo.connectionId, true);
  }

  public async saveUsername(): Promise<void> {
    try {
      await this.signalR.startConnection(this.currentUser);
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log(this.stream)
    } catch (error) {
      console.error(`Can't join room, error ${error}`);
    }
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}