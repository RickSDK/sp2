import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;

@Component({
  selector: 'app-terr-troop-select',
  templateUrl: './terr-troop-select.component.html',
  styleUrls: ['./terr-troop-select.component.scss']
})
export class TerrTroopSelectComponent extends BaseComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory: any;
  @Input('currentPlayer') currentPlayer: any;
  @Input('superpowersData') superpowersData: any;
  @Input('gameObj') gameObj: any;
  @Input('terr') terr: any;
  @Input('optionType') optionType: any;
  @Output() messageEvent = new EventEmitter<string>();

  public productionDisplayUnits = [];
  public allyNation = 1;
  public allies = [];
  public loadingFlg = false;
  public loadPlanesFlg = false;
  public loadBoatsFlg = false;
  public hostileMessage = '';
  public moveTerr = [];
  public totalMoveTerrs = [];
  public selectedUnitForm = 0;
  public selectedFormUnit: any;
  public totalUnitsThatCanMove = 0;
  public expectedHits = 0;
  public expectedLosses = 0;
  public goButton = 'Go!';
  public checkAllTroops = false;


  constructor() { super(); }

  ngOnInit(): void {
  }
  
}
