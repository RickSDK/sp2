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
import { TerritoriesViewComponent } from './territories-view/territories-view.component';
import { BattleshipPopupComponent } from './battleship-popup/battleship-popup.component';
import { CreateGamePopupComponent } from './create-game-popup/create-game-popup.component';
import { GameStandingsComponent } from './game-standings/game-standings.component';
import { MatchmakingStandingsComponent } from './matchmaking-standings/matchmaking-standings.component';
import { PlayerNameComponent } from './player-name/player-name.component';
import { MailPopupComponent } from './mail-popup/mail-popup.component';
import { ForumPopupComponent } from './forum-popup/forum-popup.component';
import { SpTableComponent } from './sp-table/sp-table.component';
import { SpTimeLeftComponent } from './sp-time-left/sp-time-left.component';
import { SpUserNameComponent } from './sp-user-name/sp-user-name.component';
import { PlayerUserNameComponent } from './player-user-name/player-user-name.component';
import { TeamBalancingComponent } from './team-balancing/team-balancing.component';
import { EditProfilePopupComponent } from './edit-profile-popup/edit-profile-popup.component';
import { UserNotificationsPopupComponent } from './user-notifications-popup/user-notifications-popup.component';
import { HomeScreenPopupComponent } from './home-screen-popup/home-screen-popup.component';
import { GoogleAdsComponent } from './google-ads/google-ads.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CampaignComponent } from './campaign/campaign.component';
import { GameDetailComponent } from './game-detail/game-detail.component';

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
    MenuPopupComponent,
    TerritoriesViewComponent,
    BattleshipPopupComponent,
    CreateGamePopupComponent,
    GameStandingsComponent,
    MatchmakingStandingsComponent,
    PlayerNameComponent,
    MailPopupComponent,
    ForumPopupComponent,
    SpTableComponent,
    SpTimeLeftComponent,
    SpUserNameComponent,
    PlayerUserNameComponent,
    TeamBalancingComponent,
    EditProfilePopupComponent,
    UserNotificationsPopupComponent,
    HomeScreenPopupComponent,
    GoogleAdsComponent,
    ProgressBarComponent,
    CampaignComponent,
    GameDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
