import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-sp-table',
  templateUrl: './sp-table.component.html',
  styleUrls: ['./sp-table.component.scss']
})
export class SpTableComponent implements OnInit {
  @Input('dataObj') dataObj: any;
  public totalRows = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.dataObj.type == 3 && this.dataObj.rows.length > 10) {
      this.totalRows = this.dataObj.rows;
      this.dataObj.rows = this.totalRows.slice(0, 10);
      this.dataObj.index = 1;
      this.dataObj.lastIndex = 10;
      this.dataObj.total = this.totalRows.length;
    }
  }

  selectGame(game) {
    console.log(game);
    $('#userPopup').modal('hide');
    localStorage.loadGameId = game.id;
    this.router.navigate(['/board']);
  }
  pageDown(num: number) {
    this.dataObj.index -= 10;
    if (this.dataObj.index < 1)
      this.dataObj.index = 1

    this.dataObj.lastIndex = this.dataObj.index + 9;
    this.dataObj.rows = this.totalRows.slice(this.dataObj.index - 1, this.dataObj.lastIndex);
  }
  pageUp(num: number) {
    this.dataObj.index += 10;
    if (this.dataObj.index > this.totalRows.length - 9)
      this.dataObj.index = this.totalRows.length - 9;

    this.dataObj.lastIndex = this.dataObj.index + 9;
    if (this.dataObj.lastIndex > this.totalRows.length)
      this.dataObj.lastIndex = this.totalRows.length;
    this.dataObj.rows = this.totalRows.slice(this.dataObj.index - 1, this.dataObj.lastIndex);
  }
}
