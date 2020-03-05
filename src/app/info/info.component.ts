import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  public buttonIdx = 0;
  public buttonList = [
  	{name: 'Info', icon: 'fa-info-circle'},
  	{name: 'Overview', icon: 'fa-eye'},
  	{name: 'Rules', icon: 'fa-book'},
  	{name: 'Nations', icon: 'fa-globe'},
  	{name: 'More', icon: 'fa-plus'},
  	];
  public superpowers = ['United States','European Union','Russian Federation','Imperial Japan','Communist China','Middle-East Federation','African Coalition','Latin Alliance'];

  constructor() { }

  ngOnInit(): void {
  }

}
