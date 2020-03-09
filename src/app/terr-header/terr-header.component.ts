import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-terr-header',
  templateUrl: './terr-header.component.html',
  styleUrls: ['./terr-header.component.scss']
})
export class TerrHeaderComponent implements OnInit {
  @Input('selectedTerritory') selectedTerritory:any;

  constructor() { }

  ngOnInit(): void {
  }

}
