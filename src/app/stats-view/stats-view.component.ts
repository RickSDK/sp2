import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.scss']
})
export class StatsViewComponent extends BaseComponent implements OnInit {
  @Input('gameObj') gameObj: any;
  @Input('displayTeams') displayTeams: any;

  constructor() { super(); }

  ngOnInit(): void {
  }

}
