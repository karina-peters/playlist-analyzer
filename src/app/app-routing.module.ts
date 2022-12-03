import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { PlaylistSimilarityComponent } from "./components/analyze/playlist-similarity/playlist-similarity.component";
import { PlaylistCompositionComponent } from "./components/analyze/playlist-composition/playlist-composition.component";
import { TrackDistributeComponent } from "./components/design/distribute-tracks/distribute-tracks.component";
import { TrackDistributionComponent } from "./components/analyze/track-distribution/track-distribution.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent },
  {
    path: "analyze-playlist-similarity",
    component: PlaylistSimilarityComponent,
  },
  {
    path: "analyze-playlist-composition",
    component: PlaylistCompositionComponent,
  },
  { path: "analyze-track-distribution", component: TrackDistributionComponent },
  { path: "design-distribute-tracks", component: TrackDistributeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
