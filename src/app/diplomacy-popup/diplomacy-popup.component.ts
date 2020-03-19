import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var acceptOfferFromNation: any;
declare var rejectOfferFromNation: any;
declare var alliesFromTreaties: any;
declare var dropAllyOfNation: any;

@Component({
  selector: 'app-diplomacy-popup',
  templateUrl: './diplomacy-popup.component.html',
  styleUrls: ['./diplomacy-popup.component.scss']
})
export class DiplomacyPopupComponent extends BaseComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<string>();
  public newsMessage = ['War Declared!', 'You have been dropped from an alliance!', 'Peace Accepted', 'Alliance Accepted', 'Offer Rejected!'];

  constructor() { super(); }

  ngOnInit(): void {
  }

  show(gameObj: any, ableToTakeThisTurn: any, currentPlayer: any, user: any) {
    this.initView(gameObj, ableToTakeThisTurn, currentPlayer, user);
    this.openModal('#diplomacyPopup');
  }
  acceptOffer(nation) {
    acceptOfferFromNation(this.currentPlayer, nation, this.gameObj, this.superpowersData);
    this.removeOffer(nation);
  }
  rejectOffer(nation) {
    rejectOfferFromNation(this.currentPlayer, nation, this.gameObj);
    this.removeOffer(nation);
  }
  removeOffer(nation) {
    var offers = [];
    this.currentPlayer.offers.forEach(offer => {
      if (offer != nation)
        offers.push(offer);
    });
    this.currentPlayer.offers = offers;
    this.checkAllies();
  }
  dropAlly(nation) {
    dropAllyOfNation(this.currentPlayer, nation, this.gameObj, this.superpowersData);
    this.checkAllies();
  }
  checkAllies() {
    this.currentPlayer.allies = alliesFromTreaties(this.currentPlayer);
		this.currentPlayer.allySpotsOpen = this.gameObj.maxAllies - this.currentPlayer.allies.length;
    if (this.currentPlayer.offers.length == 0 && this.currentPlayer.allySpotsOpen>=0) {
      this.messageEvent.emit('done');
      this.closeModal('#diplomacyPopup');
    }
  }
}
