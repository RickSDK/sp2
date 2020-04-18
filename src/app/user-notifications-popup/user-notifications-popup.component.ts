import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-user-notifications-popup',
  templateUrl: './user-notifications-popup.component.html',
  styleUrls: ['./user-notifications-popup.component.scss']
})
export class UserNotificationsPopupComponent extends BaseComponent implements OnInit {
  @Input('serverUser') serverUser: any;
  public segmentIdx = 0;

  constructor() { super(); }

  ngOnInit(): void {
  }
  submitUpdates() {

  }
}
