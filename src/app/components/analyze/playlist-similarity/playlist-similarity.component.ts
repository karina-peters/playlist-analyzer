import { Component, OnInit } from "@angular/core";
import { trigger, transition, style, animate } from "@angular/animations";
import { BehaviorSubject } from "rxjs";
import { Playlist } from "src/app/services/playlist.service";
import { Track, TrackService } from "src/app/services/track.service";
import { Artist } from "src/app/services/artist.service";
import { PlaylistService } from "src/app/services/playlist.service";
import { AlertService } from "src/app/services/alert.service";
import { DataType, SelectorConfig } from "src/app/components/base/selector/selector.component";

export interface Page {
  index: number;
  items: Array<any>;
}

@Component({
  selector: "app-playlist-similarity",
  templateUrl: "./playlist-similarity.component.html",
  styleUrls: ["./playlist-similarity.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(100px)" }),
        animate("400ms", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("100ms", style({ opacity: 0, transform: "translateY(300px)" }))]),
    ]),
  ],
})
export class PlaylistSimilarityComponent implements OnInit {
  public selectorConfig: SelectorConfig;
  public selectorOptions$: BehaviorSubject<Array<Playlist>> = new BehaviorSubject<Array<Playlist>>([]);
  public leftTracks$: BehaviorSubject<Array<Track>> = new BehaviorSubject<Array<Track>>([]);
  public rightTracks$: BehaviorSubject<Array<Track>> = new BehaviorSubject<Array<Track>>([]);

  public leftPlaylist: Playlist;
  public rightPlaylist: Playlist;
  public playlists: Array<Playlist> = [];

  public commonTracks: Array<Track> = [];
  public commonArtists: Array<Artist> = [];
  public commonGenres: Array<string> = [];

  public showStats: boolean = false;
  public totalSimilarity: number = 0;
  public trackSimilarity: number = 0;
  public artistSimilarity: number = 0;
  public genreSimilarity: number = 0;

  private artistMap: { [key: string]: Artist } = {};

  constructor(private alertService: AlertService, private playlistService: PlaylistService, private trackService: TrackService) {
    this.leftPlaylist = { index: -1, id: "", name: "", tracksLink: "", tracks: [] };
    this.rightPlaylist = { index: -1, id: "", name: "", tracksLink: "", tracks: [] };

    this.selectorConfig = {
      type: DataType.Playlist,
      allowSearch: true,
    };
  }

  ngOnInit(): void {
    this.playlistService.getPlaylists().subscribe((playlists: Array<Playlist>) => {
      this.selectorOptions$.next(playlists);
    });
  }

  public comparePlaylists(_event: Event) {
    if (!this.leftPlaylist?.tracks || !this.rightPlaylist?.tracks) {
      // TODO: maybe subscribe to alert and close it when a new playlist is selected?
      this.alertService.error("Error: one or more of the selected playlists has no tracks!");
      return;
    }

    let tracks: [{ [key: string]: number }, { [key: string]: number }] = [{}, {}];
    let artists: [{ [key: string]: number }, { [key: string]: number }] = [{}, {}];
    let genres: [{ [key: string]: number }, { [key: string]: number }] = [{}, {}];

    let outerLoopCount = 0;
    this.leftPlaylist.tracks.forEach((ltrack) => {
      // Create a map of { link : Artist } pairs for use in getCommonArtistsRanked()
      if (this.artistMap[ltrack.artist.link] == undefined) {
        this.artistMap[ltrack.artist.link] = ltrack.artist;
      }

      // Add left tracks, artist, genres to { key: count } maps
      const track = ltrack.id;
      tracks[0][track] = 1; // Shouldn't have to worry about duplicate tracks

      const artist = ltrack.artist.link;
      artists[0][artist] = (artists[0][artist] || 0) + 1;

      for (const genre of ltrack.artist.genres) {
        genres[0][genre] = (genres[0][genre] || 0) + 1;
      }

      this.rightPlaylist.tracks.forEach((rtrack) => {
        // Only add items to maps on the first loop
        if (outerLoopCount == 0) {
          if (this.artistMap[rtrack.artist.link] == undefined) {
            this.artistMap[rtrack.artist.link] = rtrack.artist;
          }

          // Add right tracks, artist, genres to { key: count } maps
          const track = rtrack.id;
          tracks[1][track] = 1;

          const artist = rtrack.artist.link;
          artists[1][artist] = (artists[1][artist] || 0) + 1;

          for (const genre of rtrack.artist.genres) {
            genres[1][genre] = (genres[1][genre] || 0) + 1;
          }
        }

        if (this.trackService.equal(ltrack, rtrack) && !this.trackService.contains(this.commonTracks, ltrack)) {
          this.commonTracks.push(ltrack);
        }
      });

      ++outerLoopCount;
    });

    this.commonArtists = this.getCommonArtistsRanked(artists);
    this.commonGenres = this.getCommonGenresRanked(genres);

    this.computeSimilarity(tracks, artists, genres);
  }

  public selectLeft(playlist: Playlist) {
    this.leftPlaylist = playlist;
    this.trackService.getTracks(playlist.tracksLink).subscribe((tracks) => {
      this.leftPlaylist.tracks = tracks;
      this.leftTracks$.next(tracks);
    });

    this.clear();
  }

  public selectRight(playlist: Playlist) {
    this.rightPlaylist = playlist;
    this.trackService.getTracks(playlist.tracksLink).subscribe((tracks) => {
      this.rightPlaylist.tracks = tracks;
      this.rightTracks$.next(tracks);
    });

    this.clear();
  }

  private getCommonArtistsRanked(artists: [{ [key: string]: number }, { [key: string]: number }]): Array<Artist> {
    let commonArtists = this.getCommonEltsRanked(artists);
    return commonArtists.map((link) => this.artistMap[link]);
  }

  private getCommonGenresRanked(genres: [{ [key: string]: number }, { [key: string]: number }]): Array<string> {
    return this.getCommonEltsRanked(genres);
  }

  private computeSimilarity(
    tracks: [{ [key: string]: number }, { [key: string]: number }],
    artists: [{ [key: string]: number }, { [key: string]: number }],
    genres: [{ [key: string]: number }, { [key: string]: number }]
  ): void {
    const T_WEIGHT = 0.6;
    const A_WEIGHT = 0.3;
    const G_WEIGHT = 0.1;

    let tSimilarity = this.cosineSimilarity(tracks[0], tracks[1]);
    let aSimilarity = this.cosineSimilarity(artists[0], artists[1]);
    let gSimilarity = this.cosineSimilarity(genres[0], genres[1]);
    let totalSimilarity = T_WEIGHT * tSimilarity + A_WEIGHT * aSimilarity + G_WEIGHT * gSimilarity;

    this.totalSimilarity = Math.round(totalSimilarity * 100);
    this.trackSimilarity = Math.round(tSimilarity * 100);
    this.artistSimilarity = Math.round(aSimilarity * 100);
    this.genreSimilarity = Math.round(gSimilarity * 100);

    this.showStats = true;
  }

  private dotProduct(vecA: Array<number>, vecB: Array<number>) {
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }

    return dotProduct;
  }

  private magnitude(vec: Array<number>) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
      sum += vec[i] * vec[i];
    }

    return Math.sqrt(sum);
  }

  private cosineSimilarity(mapA: { [key: string]: number }, mapB: { [key: string]: number }) {
    let unionKeys = [...new Set(Object.keys(mapA).concat(Object.keys(mapB)))];

    let vecA = this.mapToVector(mapA, unionKeys);
    let vecB = this.mapToVector(mapB, unionKeys);

    return this.dotProduct(vecA, vecB) / (this.magnitude(vecA) * this.magnitude(vecB));
  }

  /**
   * Translates a map of { key : count } pairs into a vector for calculating cosine similarity
   * @param map A map { key : count } pairs
   * @param unionKeys All keys to be included in the vector
   * @returns A vector representation of the given map
   */
  private mapToVector(map: { [key: string]: number }, unionKeys: Array<string>): Array<number> {
    let vector = [];
    for (let key of unionKeys) {
      vector.push(map[key] || 0);
    }

    return vector;
  }

  /**
   * Assembles common elements and ranks them according to number of occurences
   * @param elts The two arrays of { key : count } pairs to intersect
   * @returns An Array of common element keys, ranked
   */
  private getCommonEltsRanked(elts: [{ [key: string]: number }, { [key: string]: number }]): Array<string> {
    let sortedA = Object.entries(elts[0]).sort((a, b) => {
      return b[1] - a[1];
    });
    let sortedB = Object.entries(elts[1]).sort((a, b) => {
      return b[1] - a[1];
    });

    let commonElements: Array<{ [key: string]: number }> = [];
    sortedA.forEach((entryA, indexA) => {
      let indexB = sortedB.findIndex((entryB) => {
        return entryA[0] == entryB[0];
      });

      if (indexB != -1) {
        let entry: { [key: string]: number } = {};
        entry[entryA[0]] = indexA + indexB;

        commonElements.push(entry);
      }
    });

    let sortedCommon = commonElements
      .sort((a, b) => {
        return a[1] - b[1];
      })
      .map((v) => Object.keys(v)[0]);

    return sortedCommon;
  }

  private clear() {
    this.commonTracks = [];
    this.commonArtists = [];
    this.commonGenres = [];

    this.showStats = false;
  }
}
