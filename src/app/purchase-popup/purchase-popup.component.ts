import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-purchase-popup',
  templateUrl: './purchase-popup.component.html',
  styleUrls: ['./purchase-popup.component.scss']
})
export class PurchasePopupComponent implements OnInit {
  public showPageFlg = false;

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    this.showPageFlg = true;
    $("#purchasePopup").modal();
  }

}
