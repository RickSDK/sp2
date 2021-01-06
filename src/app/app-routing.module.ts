import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { BoardComponent } from './board/board.component';
import { InfoComponent } from './info/info.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { CampaignComponent } from './campaign/campaign.component';

const routes: Routes = [
	{ path: '', component: MainPageComponent},
	{ path: 'board', component: BoardComponent},
	{ path: 'info', component: InfoComponent},
	{ path: 'multiplayer', component: MultiplayerComponent},
	{ path: 'campaign', component: CampaignComponent},
	];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
