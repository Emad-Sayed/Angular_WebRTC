import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserInfo } from '../models/myInterfaces';
import { Observable } from 'rxjs';
import { RtcService } from '../service/rtc.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  @Output() userSelected: EventEmitter<UserInfo> = new EventEmitter();

  public users$: Observable<Array<UserInfo>>;


  constructor(private rtcService: RtcService) { }

  ngOnInit() {
    this.users$ = this.rtcService.users;
  }

  public userClicked(user: UserInfo) {
    this.userSelected.emit(user);
  }


}
