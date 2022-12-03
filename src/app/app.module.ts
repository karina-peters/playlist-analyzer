import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PlaylistSimilarityComponent } from "./components/analyze/playlist-similarity/playlist-similarity.component";
import { PlaylistCompositionComponent } from "./components/analyze/playlist-composition/playlist-composition.component";
import { NavHeaderComponent } from "./components/nav-header/nav-header.component";
import { PlaylistSelectComponent } from "./components/base/playlist-select/playlist-select.component";
import { TrackComponent } from "./components/base/track/track.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { TrackDistributeComponent } from "./components/design/distribute-tracks/distribute-tracks.component";
import { TrackDistributionComponent } from "./components/analyze/track-distribution/track-distribution.component";
import { TrackListComponent } from "./components/base/track-list/track-list.component";
import { TrackTableComponent } from "./components/base/track-table/track-table.component";

@NgModule({
  declarations: [
    AppComponent,
    PlaylistSimilarityComponent,
    PlaylistCompositionComponent,
    NavHeaderComponent,
    PlaylistSelectComponent,
    TrackComponent,
    LoginComponent,
    HomeComponent,
    TrackDistributeComponent,
    TrackDistributionComponent,
    TrackListComponent,
    TrackTableComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
