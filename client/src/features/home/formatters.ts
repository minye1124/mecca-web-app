export function formatPublishedDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-AU", {
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));
}

export function formatReadTime(readTimeMinutes: number) {
  return `${readTimeMinutes} minute read`;
}
