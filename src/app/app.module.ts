import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HeaderComponent } from './header/header.component';
import { BoardComponent } from './board/board.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { RulesPopupComponent } from './rules-popup/rules-popup.component';
import { TypesPopupComponent } from './types-popup/types-popup.component';
import { RanksPopupComponent } from './ranks-popup/ranks-popup.component';
import { EmailPopupComponent } from './email-popup/email-popup.component';
import { NationsPopupComponent } from './nations-popup/nations-popup.component';
import { UserPopupComponent } from './user-popup/user-popup.component';
import { ScoreboardPopupComponent } from './scoreboard-popup/scoreboard-popup.component';
import { VideoPopupComponent } from './video-popup/video-popup.component';
import { StartGamePopupComponent } from './start-game-popup/start-game-popup.component';
import { UnitsPopupComponent } from './units-popup/units-popup.component';
import { AudioPopupComponent } from './audio-popup/audio-popup.component';
import { PurchasePopupComponent } from './purchase-popup/purchase-popup.component';
import { TechPopupComponent } from './tech-popup/tech-popup.component';
import { TechComponent } from './tech/tech.component';
import { InfoComponent } from './info/info.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { TerritoryPopupComponent } from './territory-popup/territory-popup.component';
import { MessagePopupComponent } from './message-popup/message-popup.component';
import { LoadingPopupComponent } from './loading-popup/loading-popup.component';
import { LeaderMessagePopupComponent } from './leader-message-popup/leader-message-popup.component';
import { UnitDetailPopupComponent } from './unit-detail-popup/unit-detail-popup.component';
import { GamePlayersPopupComponent } from './game-players-popup/game-players-popup.component';
import { UnitDetailComponent } from './unit-detail/unit-detail.component';
import { LogsPopupComponent } from './logs-popup/logs-popup.component';
import { ChatPopupComponent } from './chat-popup/chat-popup.component';
import { BaseComponent } from './base/base.component';
import { TerrUnitsComponent } from './terr-units/terr-units.component';
import { TerrHeaderComponent } from './terr-header/terr-header.component';
import { TerrAdviceComponent } from './terr-advice/terr-advice.component';
import { TerrButtonsComponent } from './terr-buttons/terr-buttons.component';
import { TerrPurchaseComponent } from './terr-purchase/terr-purchase.component';
import { TerrTroopSelectComponent } from './terr-troop-select/terr-troop-select.component';
import { DiplomacyPopupComponent } from './diplomacy-popup/diplomacy-popup.component';
import { ProductionQueuePopupComponent } from './production-queue-popup/production-queue-popup.component';
import { PlayerViewComponent } from './player-view/player-view.component';
import { AlliesViewComponent } from './allies-view/allies-view.component';
import { StatsViewComponent } from './stats-view/stats-view.component';
import { GameViewComponent } from './game-view/game-view.component';
import { MenuPopupComponent } from './menu-popup/menu-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    BoardComponent,
    LoginPopupComponent,
    RulesPopupComponent,
    TypesPopupComponent,
    RanksPopupComponent,
    EmailPopupComponent,
    NationsPopupComponent,
    UserPopupComponent,
    ScoreboardPopupComponent,
    VideoPopupComponent,
    StartGamePopupComponent,
    UnitsPopupComponent,
    AudioPopupComponent,
    PurchasePopupComponent,
    TechPopupComponent,
    TechComponent,
    InfoComponent,
    MultiplayerComponent,
    TerritoryPopupComponent,
    MessagePopupComponent,
    LoadingPopupComponent,
    LeaderMessagePopupComponent,
    UnitDetailPopupComponent,
    GamePlayersPopupComponent,
    UnitDetailComponent,
    LogsPopupComponent,
    ChatPopupComponent,
    BaseComponent,
    TerrUnitsComponent,
    TerrHeaderComponent,
    TerrAdviceComponent,
    TerrButtonsComponent,
    TerrPurchaseComponent,
    TerrTroopSelectComponent,
    DiplomacyPopupComponent,
    ProductionQueuePopupComponent,
    PlayerViewComponent,
    AlliesViewComponent,
    StatsViewComponent,
    GameViewComponent,
    MenuPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
