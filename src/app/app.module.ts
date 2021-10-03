import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlaylistCompareComponent } from './components/playlist-compare/playlist-compare.component';
import { PlaylistAnalysisComponent } from './components/playlist-analysis/playlist-analysis.component';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { PlaylistSelectComponent } from './components/playlist-select/playlist-select.component';
import { TrackComponent } from './components/track/track.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistCompareComponent,
    PlaylistAnalysisComponent,
    NavHeaderComponent,
    PlaylistSelectComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
