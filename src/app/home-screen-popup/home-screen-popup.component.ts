import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-home-screen-popup',
  templateUrl: './home-screen-popup.component.html',
  styleUrls: ['./home-screen-popup.component.scss']
})
export class HomeScreenPopupComponent extends BaseComponent implements OnInit {
  public buttonIdx = 0;
  constructor() { super(); }

  ngOnInit(): void {
  }
	show() {
    localStorage.showHomeButtonFlg = 'Y';
		this.openModal('#homeScreenPopup');
	}
}
