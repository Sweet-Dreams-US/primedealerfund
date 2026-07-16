/**
 * The latest external podcast appearance, surfaced at the top of the homepage
 * and again at the top of /media. Single source of truth so the two stay in
 * sync — when a newer episode drops, edit this file only.
 *
 * Links verified 2026-07-16 against the YouTube oEmbed API, the iTunes Search
 * API, and the Spotify show page (episode published 2026-07-15).
 */

export type EpisodePlatform = {
  id: "youtube" | "spotify" | "apple" | "site";
  label: string;
  href: string;
};

export const featuredEpisode = {
  show: "Dropping Bombs",
  host: "Brad Lea",
  title: "The Hidden Business That Prints Money (And Nobody Will Let You In)",
  guests: "Kyle Coleman & Ralph Marcuccilli",
  dateLabel: "July 15, 2026",
  duration: "1h 13m",
  /** YouTube video id — drives the inline embed. */
  embedId: "_-X9uj981mY",
  blurb:
    "Kyle Coleman and Ralph Marcuccilli sit down with Brad Lea to break down franchise dealerships — why they are one of the hardest businesses in America to get into, and how the Coleman Prime platform acquires and operates them.",
  /** First entry is rendered as the primary button; the rest as outline links. */
  platforms: [
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/watch?v=_-X9uj981mY",
    },
    {
      id: "spotify",
      label: "Spotify",
      href: "https://open.spotify.com/episode/69dcXm4CkuzBaDyUmP0e3m",
    },
    {
      id: "apple",
      label: "Apple Podcasts",
      href: "https://podcasts.apple.com/us/podcast/the-hidden-business-that-prints-money-and-nobody-will/id1260808808?i=1000776975314",
    },
    {
      id: "site",
      label: "Dropping Bombs",
      href: "https://www.droppingbombs.com/",
    },
  ] satisfies EpisodePlatform[],
};
