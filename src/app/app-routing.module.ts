import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistCompareComponent } from './components/playlist-compare/playlist-compare.component';
import { PlaylistAnalysisComponent } from './components/playlist-analysis/playlist-analysis.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'compare-playlists', component: PlaylistCompareComponent },
  { path: 'analyze-playlist', component: PlaylistAnalysisComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
