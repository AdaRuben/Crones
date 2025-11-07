export const MOSCOW_BOUNDS: [number, number][] = [
  [55.15, 36.8],
  [56.1, 38.35],
];

export const MAP_CENTER: [number, number] = [55.751244, 37.618423];

export async function geocode(
  ymaps: typeof window.ymaps,
  query: string,
): Promise<{ address: string; coords: number[] } | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const res = await ymaps.geocode(trimmed, {
    results: 1,
    boundedBy: MOSCOW_BOUNDS,
    strictBounds: true,
  });

  const obj = res.geoObjects.get(0);
  if (!obj) return null;

  return {
    address: obj.getAddressLine(),
    coords: obj.geometry!.getCoordinates() as number[],
  };
}

export async function geocodeByCoords(
  ymaps: typeof window.ymaps,
  coords: number[],
): Promise<string> {
  const res = await ymaps.geocode(coords, {
    results: 1,
    boundedBy: MOSCOW_BOUNDS,
    strictBounds: true,
  });

  const first = res.geoObjects.get(0);
  return first ? first.getAddressLine() : coords.map((n) => n.toFixed(6)).join(', ');
}

export async function suggest(
  ymaps: typeof window.ymaps,
  query: string,
): Promise<Array<{ value: string; displayName: string }>> {
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