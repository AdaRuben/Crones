export const MOSCOW_BOUNDS: [number, number][] = [
  [55.15, 36.8],
  [56.1, 38.35],
];

export const MAP_CENTER: [number, number] = [55.751244, 37.618423];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function geocode(ymaps: typeof window.ymaps, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const res = await ymaps.geocode(trimmed, {
      results: 1,
      boundedBy: MOSCOW_BOUNDS,
      strictBounds: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const obj = res.geoObjects.get(0);
    if (!obj) return null;

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      address: obj.getAddressLine(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-member-access
      coords: obj.geometry!.getCoordinates() as number[],
    };
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err?.message === 'scriptError') return null; // “не нашли, но без крэша”
    throw err;
  }
}

export async function geocodeByCoords(
  ymaps: typeof window.ymaps,
  coords: number[],
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const res = await ymaps.geocode(coords, {
    results: 1,
    boundedBy: MOSCOW_BOUNDS,
    strictBounds: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const first = res.geoObjects.get(0);
  return first ? first.getAddressLine() : coords.map((n) => n.toFixed(6)).join(', ');
}

export async function suggest(
  ymaps: typeof window.ymaps,
  query: string,
): Promise<{ value: string; displayName: string }[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const items = await ymaps.suggest(trimmed, {
    results: 6,
    boundedBy: MOSCOW_BOUNDS,
    strictBounds: true,
    provider: 'yandex#search',
  });

  return items.map((item) => ({
    value: item.value,
    displayName: item.displayName || item.value,
  }));
}
