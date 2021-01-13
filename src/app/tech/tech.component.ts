import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss']
})
export class TechComponent extends BaseComponent implements OnInit {
  @Input('tech') tech:any;
  @Input('descFlg') descFlg:any;
  @Input('adminFlg') adminFlg:any;
  @Input('gameObj') gameObj:any;
  
  constructor() { super(); }

  ngOnInit(): void {
  }

}
