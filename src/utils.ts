export function typedKeys<T>(t: T) {
  return Object.keys(t) as Array<keyof T>;
}

/**
 * Creates a pseudo-witness of a given type. That is, it pretends to return a value of
 * type `T` for any `T`, but it's really just returning `undefined`. This white lie
 * allows convenient expression of the value types in the payloads you pass to
 * `defineActions`.
 */
export const type = <T>() => (undefined as any) as T;
