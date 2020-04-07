import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var userObjFromUser: any;
declare var playClick: any;

@Component({
  selector: 'app-ranks-popup',
  templateUrl: './ranks-popup.component.html',
  styleUrls: ['./ranks-popup.component.scss']
})
export class RanksPopupComponent extends BaseComponent implements OnInit {
  public ranks = [];
  public specialUnits = [];
  public user: any;

  constructor() { super(); }

  ngOnInit(): void {
    this.user = userObjFromUser();
    this.changeSegment(0);
  }
  show() {
    $("#ranksPopup").modal();
  }
  changeSegment(num: number) {
    this.segmentIdx = num;
    playClick();
    var ranks = [];
    if (num == 0) {
      ranks.push(this.superpowersData.ranks[0]);
      ranks.push(this.superpowersData.ranks[1]);
      ranks.push(this.superpowersData.ranks[2]);
      ranks.push(this.superpowersData.ranks[3]);
    }
    if (num == 1) {
      ranks.push(this.superpowersData.ranks[4]);
      ranks.push(this.superpowersData.ranks[5]);
      ranks.push(this.superpowersData.ranks[6]);
    }
    if (num == 2) {
      ranks.push(this.superpowersData.ranks[7]);
      ranks.push(this.superpowersData.ranks[8]);
      ranks.push(this.superpowersData.ranks[9]);
    }
    if (num == 3) {
      ranks.push(this.superpowersData.ranks[10]);
      ranks.push(this.superpowersData.ranks[11]);
      ranks.push(this.superpowersData.ranks[12]);
      ranks.push(this.superpowersData.ranks[13]);
    }
    if (num == 4) {
      ranks.push(this.superpowersData.ranks[14]);
      ranks.push(this.superpowersData.ranks[15]);
      ranks.push(this.superpowersData.ranks[16]);
      ranks.push(this.superpowersData.ranks[17]);
      ranks.push(this.superpowersData.ranks[18]);
    }
    this.ranks = ranks;

    var specialUnits = [];
    if (num > 0)
      for (var x = 0; x < 8; x++)
        specialUnits.push((num * 8) + x + 12);

    this.specialUnits = specialUnits;
  }

}
