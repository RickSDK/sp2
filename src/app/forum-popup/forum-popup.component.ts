import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-forum-popup',
  templateUrl: './forum-popup.component.html',
  styleUrls: ['./forum-popup.component.scss']
})
export class ForumPopupComponent extends BaseComponent implements OnInit {
  @Input('user') user: any;

  constructor() { super(); }

  ngOnInit(): void {
  }
	show() {
		this.openModal('#forumPopup');
	}
}
