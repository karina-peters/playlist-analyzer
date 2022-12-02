import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { PlaylistCompareComponent } from "./components/analyse/playlist-similarity/playlist-similarity.component";
import { PlaylistAnalysisComponent } from "./components/analyse/playlist-composition/playlist-composition.component";
import { TrackDistributeComponent } from "./components/design/distribute-tracks/distribute-tracks.component";
import { TrackDistributionComponent } from "./components/analyse/track-distribution/track-distribution.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "analyse-playlist-similarity", component: PlaylistCompareComponent },
  {
    path: "analyse-playlist-composition",
    component: PlaylistAnalysisComponent,
  },
  { path: "analyse-track-distribution", component: TrackDistributionComponent },
  { path: "design-distribute-tracks", component: TrackDistributeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
