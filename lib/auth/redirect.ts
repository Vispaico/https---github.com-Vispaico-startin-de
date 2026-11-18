export function safePostAuthPath(value: string | null | undefined) {
  // The current public-to-private journey always returns to the document workspace.
  // Keep this allowlist explicit so query-string redirects cannot become open redirects.
  return value === '/app' ? '/app' : '/app';
}
