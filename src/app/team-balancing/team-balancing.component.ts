import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-team-balancing',
  templateUrl: './team-balancing.component.html',
  styleUrls: ['./team-balancing.component.scss']
})
export class TeamBalancingComponent implements OnInit {
  @Input('gameObj') gameObj: any;

  constructor() { }

  ngOnInit(): void {
  }

}
