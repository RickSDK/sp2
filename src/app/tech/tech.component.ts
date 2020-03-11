import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss']
})
export class TechComponent implements OnInit {
  @Input('tech') tech:any;
  @Input('descFlg') descFlg:any;
  @Input('adminFlg') adminFlg:any;
  @Input('gameObj') gameObj:any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
