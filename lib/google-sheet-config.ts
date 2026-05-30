export const publicMarketingSheets = {
  deadlines: {
    id: process.env.GOOGLE_PUBLIC_DEADLINES_SHEET_ID ?? "1EMgrSN-hYxHDPsm0PfO7fCp7rga3hlazFw6JGpW9XHY",
    gid: process.env.GOOGLE_PUBLIC_DEADLINES_GID ?? "2147133173"
  },
  contentSchedule: {
    id: process.env.GOOGLE_PUBLIC_CONTENT_SCHEDULE_SHEET_ID ?? "13qX5JmnviqWSwVIntdj4jfkQMtjXb3ez0C-OhD0yx68",
    gid: process.env.GOOGLE_PUBLIC_CONTENT_SCHEDULE_GID ?? "1363943918"
  },
  videoSchedule: {
    id: process.env.GOOGLE_PUBLIC_VIDEO_SCHEDULE_SHEET_ID ?? "1-E-5uvUhR1F9Yksg0ZWlotkGbozz3frWrs0JIUb4n7g",
    gid: process.env.GOOGLE_PUBLIC_VIDEO_SCHEDULE_GID ?? "1580932031"
  },
  eventSchedule: {
    id: process.env.GOOGLE_PUBLIC_EVENT_SCHEDULE_SHEET_ID ?? "1peepjk9hBojquQDdkKw0KO4kFItUUtpKVxFQBUX8UJc",
    gid: process.env.GOOGLE_PUBLIC_EVENT_SCHEDULE_GID ?? "955495011"
  }
};
