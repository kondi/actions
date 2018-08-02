export type ScopedString<MT extends PropertyKey, S extends string> = string & {
  ȋnternal: { mainType: MT; scope: S };
};

export function scopeString<MT extends PropertyKey, S extends string>(
  mainType: MT,
  scope: S,
): ScopedString<MT, S> {
  return `[${scope}] ${mainType}` as ScopedString<MT, S>;
}
