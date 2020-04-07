import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-mail-popup',
  templateUrl: './mail-popup.component.html',
  styleUrls: ['./mail-popup.component.scss']
})
export class MailPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;

  constructor() { super(); }

  ngOnInit(): void {
  }
	show() {
		this.openModal('#mailPopup');
	}
}
