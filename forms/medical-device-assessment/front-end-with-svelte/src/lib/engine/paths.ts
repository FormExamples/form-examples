// Dotted-path access into the wizard state, shared by the store and the
// field renderer. Ported from getPath/setPath in the HTML form-app.js.

export function getPath(obj: object, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), obj);
}

export function setPath(obj: object, path: string, value: unknown): void {
  const keys = path.split('.');
  let o = obj as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]] as Record<string, unknown>;
  o[keys[keys.length - 1]] = value;
}

/** An answer counts when it is neither blank nor null/undefined. */
export function isAnswered(value: unknown): boolean {
  return value !== '' && value !== null && value !== undefined;
}

/** Stable DOM id for a field path, e.g. `manufacturer.name` -> `f-manufacturer-name`. */
export function fieldId(path: string): string {
  return 'f-' + path.replace(/\./g, '-');
}
