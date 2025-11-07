import { type ChangeEvent, type FocusEvent, JSX, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import './app.css';

declare global {
  interface Window {
    ymaps: typeof ymaps;
  }
}

const MOSCOW_BOUNDS: [number, number][] = [
  [55.15, 36.8],
  [56.1, 38.35],
];

const MAP_CENTER: [number, number] = [55.751244, 37.618423];

type PointData = { address: string; coords: number[] | null };
type PointType = 'from' | 'to';
type RouteInfo = { distance: string; time: string } | null;

export default function App(): JSX.Element {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const ymapsRef = useRef<typeof ymaps>();
  const mapInstance = useRef<ymaps.Map | null>(null);
  const routeRef = useRef<ymaps.multiRouter.MultiRoute | null>(null);
  const activePointRef = useRef<PointType>('from');

  // SuggestView
  const fromInputRef = useRef<HTMLInputElement | null>(null);
  const toInputRef = useRef<HTMLInputElement | null>(null);
  const suggestFromRef = useRef<ymaps.SuggestView | null>(null);
  const suggestToRef = useRef<ymaps.SuggestView | null>(null);

  const [activePoint, setActivePoint] = useState<PointType>('from');
  const [from, setFrom] = useState<PointData>({ address: '', coords: null });
  const [to, setTo] = useState<PointData>({ address: '', coords: null });
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  useEffect(() => {
    window.ymaps.ready(() => {
      ymapsRef.current = window.ymaps;

      const ymap = new window.ymaps.Map(
        mapRef.current!,
        {
          center: MAP_CENTER,
          zoom: 12,
          controls: ['zoomControl', 'geolocationControl'],
        },
        {
          suppressMapOpenBlock: true,
          restrictMapArea: MOSCOW_BOUNDS,
        },
      );

      ymap.options.set('maxZoom', 19);
      ymap.behaviors.enable('drag');

      // Инициализация подсказок для обоих полей
      const suggestOptions: ymaps.ISuggestViewParameters = {
        results: 8,
        provider: 'yandex#map',
        boundedBy: MOSCOW_BOUNDS,
      };

      if (fromInputRef.current) {
        const sFrom = new ymapsRef.current!.SuggestView(fromInputRef.current, suggestOptions);
        sFrom.events.add('select', (e: ymaps.IEvent) => {
          const item = e.get('item') as { value: string } | undefined;
          if (!item) return;
          setFrom({ address: item.value, coords: null });
          setActivePoint('to');
          void geocodeAddress(item.value, 'from');
        });
        suggestFromRef.current = sFrom;
      }

      if (toInputRef.current) {
        const sTo = new ymapsRef.current!.SuggestView(toInputRef.current, suggestOptions);
        sTo.events.add('select', (e: ymaps.IEvent) => {
          const item = e.get('item') as { value: string } | undefined;
          if (!item) return;
          setTo({ address: item.value, coords: null });
          setActivePoint('from');
          void geocodeAddress(item.value, 'to');
        });
        suggestToRef.current = sTo;
      }

      // Клик по карте — расставляем точки с обратным геокодом
      ymap.events.add('click', async (event) => {
        const coords = event.get('coords') as number[];
        const address = await resolveAddress(coords);

        if (activePointRef.current === 'from') {
          setFrom({ address, coords });
          setActivePoint('to');
        } else {
          setTo({ address, coords });
          setActivePoint('from');
        }
      });

      mapInstance.current = ymap;
    });

    return () => {
      suggestFromRef.current?.destroy();
      suggestToRef.current?.destroy();
      routeRef.current?.model.destroy();
      mapInstance.current?.destroy();
    };
  }, []);

  useEffect(() => {
    activePointRef.current = activePoint;
  }, [activePoint]);

  // Перестроение маршрута
  useEffect(() => {
    if (!mapInstance.current || !ymapsRef.current) return;

    if (!from.coords || !to.coords) {
      if (routeRef.current) {
        mapInstance.current.geoObjects.remove(routeRef.current);
        routeRef.current = null;
      }
      setRouteInfo(null);
      return;
    }

    const multiRoute = new ymapsRef.current.multiRouter.MultiRoute(
      {
        referencePoints: [from.coords, to.coords],
        params: { routingMode: 'auto' },
      },
      { boundsAutoApply: true },
    );

    multiRoute.model.events
      .add('requestsuccess', () => {
        const activeRoute = multiRoute.getActiveRoute();
        if (!activeRoute) return;
        const distance = activeRoute.properties.get('distance').text as string;
        const time = activeRoute.properties.get('duration').text as string;
        setRouteInfo({ distance, time });
      })
      .add('requestfail', () => setRouteInfo(null));

    if (routeRef.current) {
      mapInstance.current.geoObjects.remove(routeRef.current);
    }
    routeRef.current = multiRoute;
    mapInstance.current.geoObjects.add(multiRoute);
  }, [from.coords, to.coords]);

  async function resolveAddress(coords: number[]): Promise<string> {
    const res = await ymapsRef.current!.geocode(coords, {
      results: 1,
      boundedBy: MOSCOW_BOUNDS,
      strictBounds: true,
    });
    const first = res.geoObjects.get(0);
    return first ? first.getAddressLine() : coords.map((n) => n.toFixed(6)).join(', ');
  }

  async function geocodeAddress(value: string, type: PointType): Promise<void> {
    if (!ymapsRef.current) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    const res = await ymapsRef.current.geocode(trimmed, {
      results: 1,
      boundedBy: MOSCOW_BOUNDS,
      strictBounds: true,
    });

    const obj = res.geoObjects.get(0);
    if (!obj) return;

    const coords = obj.geometry!.getCoordinates() as number[];
    const address = obj.getAddressLine();

    if (type === 'from') {
      setFrom({ address, coords });
      setActivePoint('to');
    } else {
      setTo({ address, coords });
      setActivePoint('from');
    }

    mapInstance.current?.setCenter(coords, 15);
  }

  const handleInputChange = (type: PointType) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (type === 'from') {
      setFrom((prev) => ({ ...prev, address: value, coords: null }));
    } else {
      setTo((prev) => ({ ...prev, address: value, coords: null }));
    }
  };

  const handleInputFocus = (type: PointType) => () => setActivePoint(type);

  const handleInputBlur = (type: PointType) => (event: FocusEvent<HTMLInputElement>) => {
    // По blur всё равно валидируем адрес геокодером
    void geocodeAddress(event.target.value, type);
  };

  const handleInputKeyDown = (type: PointType) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void geocodeAddress((event.target as HTMLInputElement).value, type);
    }
  };

  const swapPoints = () => {
    setFrom((prevFrom) => {
      const nextFrom = to ? { ...to } : { address: '', coords: null };
      setTo(prevFrom ? { ...prevFrom } : { address: '', coords: null });
      return nextFrom;
    });
  };

  const clearRoute = () => {
    setFrom({ address: '', coords: null });
    setTo({ address: '', coords: null });
    setRouteInfo(null);
    setActivePoint('from');
  };

  return (
    <div className="app">
      <div ref={mapRef} className="map" />

      <section className={`bottom-sheet ${sheetExpanded ? 'expanded' : ''}`}>
        <button
          type="button"
          className="sheet-handle"
          onClick={() => setSheetExpanded((value) => !value)}
        />

        <header>
          <div className="title">Поездка</div>
          {routeInfo && (
            <div className="route-info">
              <span>{routeInfo.distance}</span>
              <span>•</span>
              <span>{routeInfo.time}</span>
            </div>
          )}
        </header>

        <div className="form">
          <div className="input-wrapper">
            <label className={activePoint === 'from' ? 'active' : ''}>
              Откуда
              <input
                ref={fromInputRef}
                value={from.address}
                placeholder="Откуда забрать?"
                onFocus={handleInputFocus('from')}
                onChange={handleInputChange('from')}
                onBlur={handleInputBlur('from')}
                onKeyDown={handleInputKeyDown('from')}
              />
            </label>
          </div>

          <button type="button" className="swap" onClick={swapPoints} aria-label="Поменять местами" />

          <div className="input-wrapper">
            <label className={activePoint === 'to' ? 'active' : ''}>
              Куда
              <input
                ref={toInputRef}
                value={to.address}
                placeholder="Куда едем?"
                onFocus={handleInputFocus('to')}
                onChange={handleInputChange('to')}
                onBlur={handleInputBlur('to')}
                onKeyDown={handleInputKeyDown('to')}
              />
            </label>
          </div>
        </div>

        <footer>
          <button type="button" className="secondary" onClick={clearRoute}>
            Очистить
          </button>
          <button type="button" className="primary">
            Заказать такси
          </button>
        </footer>
      </section>
    </div>
  );
}
