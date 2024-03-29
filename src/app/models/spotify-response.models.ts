export interface IPlaylistsDTO {
  collaborative: boolean;
  description: string;
  external_urls: Object;
  followers: IFollowers;
  href: string;
  id: string;
  images: Array<IImage>;
  name: string;
  owner: IOwner;
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: IReference;
  type: string;
}

export interface IPlaylistTrackDTO {
  added_at: string;
  external_urls: Object;
  primary_color: any;
  track: ITrack;
  video_thumbnail: Object;
}

export interface IArtistDTO {
  external_urls: Object;
  followers: IFollowers;
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<IImage>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ISearchResultsDTO {
  tracks: IReference;
  artists: IReference;
  albums: IReference;
  playlists: IReference;
  shows: IReference;
  episodes: IReference;
  audiobooks: IReference;
}

export interface IUserDTO {
  country: string;
  display_name: string;
  email: string;
  explicit_content: Object;
  external_urls: Object;
  followers: IFollowers;
  href: string;
  id: string;
  images: Array<IImage>;
  product: string;
  type: string;
  uri: string;
}

export interface IAlbum {
  album_type: string;
  artists: Array<IReference>;
  available_markets: Array<string>;
  external_urls: Object;
  href: string;
  id: string;
  images: Array<IImage>;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface ITrack {
  album: IAlbum;
  artists: Array<IArtistDTO>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: Object;
  external_urls: Object;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: true;
  track_number: number;
  type: string;
  uri: string;
}

export interface IReference {
  href: string;
  items: Array<any>;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface IUserReference {
  external_urls: Object;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface IOwner {
  external_urls: any;
  followers: IFollowers;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface IFollowers {
  href: string;
  total: number;
}

export interface IImage {
  url: string;
  height: number;
  width: number;
}
