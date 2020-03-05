import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-purchase-popup',
  templateUrl: './purchase-popup.component.html',
  styleUrls: ['./purchase-popup.component.scss']
})
export class PurchasePopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#purchasePopup").modal();
  }

}
