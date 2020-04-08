import { Component, OnInit, Input } from '@angular/core';

declare var numberVal: any;

@Component({
  selector: 'app-sp-time-left',
  templateUrl: './sp-time-left.component.html',
  styleUrls: ['./sp-time-left.component.scss']
})
export class SpTimeLeftComponent implements OnInit {
  @Input('timeLeftStr') timeLeftStr: any;

  constructor() { }

  ngOnInit(): void {
  }
  ngStyleTimeLeft(timeLeftStr: string) {
    if (timeLeftStr == '-Times up-')
      return { 'color': 'black' };

    var c = timeLeftStr.split(' ');
    var hours = numberVal(c[0]);
    var type = c[1];
    if (type == 'mins' || hours <= 8)
      return { 'color': 'red' };
    if (type == 'mins' || hours <= 15)
      return { 'color': 'purple' };

    return { 'color': 'green' };
  }

}
