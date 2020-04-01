import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleshipPopupComponent } from './battleship-popup.component';

describe('BattleshipPopupComponent', () => {
  let component: BattleshipPopupComponent;
  let fixture: ComponentFixture<BattleshipPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleshipPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleshipPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
