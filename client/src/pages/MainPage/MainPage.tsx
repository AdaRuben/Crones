import { useEffect, useRef } from 'react';
import {
  clearRoute,
  hideSuggestions,
  setActivePoint,
  setPoint,
  setRouteInfo,
  swapPoints,
  toggleSheet,
} from '../../entities/maps/slice/MapSlices';
import { fetchGeocode, fetchSuggestions } from '../../entities/maps/thunks/MapThunks';
import { MAP_CENTER, MOSCOW_BOUNDS, geocodeByCoords } from '../../entities/maps/api/MapApi';
import { useAppDispatch, useAppSelector } from '../../shared/api/hooks';
import './MainPage.css';

export default function MainPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { activePoint, from, to, sheetExpanded, suggestions, suggestVisible, routeInfo } =
    useAppSelector((state) => state.map);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<ymaps.Map | null>(null);
  const routeRef = useRef<ymaps.multiRouter.MultiRoute | null>(null);
  const ymapsRef = useRef<typeof ymaps>();
  const activePointRef = useRef(activePoint);

  useEffect(() => {
    activePointRef.current = activePoint;
  }, [activePoint]);

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

      ymap.events.add('click', async (event) => {
        const coords = event.get('coords') as number[];
        const address = await geocodeByCoords(window.ymaps, coords);
        const pointType = activePointRef.current;

        dispatch(setPoint({ type: pointType, point: { address, coords } }));
        dispatch(setActivePoint(pointType === 'from' ? 'to' : 'from'));
        dispatch(hideSuggestions());
      });

      mapInstance.current = ymap;
    });

    return () => {
      routeRef.current?.model.destroy();
      mapInstance.current?.destroy();
    };
  }, [dispatch]);

  useEffect(() => {
    const currentYmaps = ymapsRef.current;
    if (!mapInstance.current || !currentYmaps) return;

    if (!from.coords || !to.coords) {
      if (routeRef.current) {
        mapInstance.current.geoObjects.remove(routeRef.current);
        routeRef.current = null;
      }
      dispatch(setRouteInfo(null));
      return;
    }

    const route = new currentYmaps.multiRouter.MultiRoute(
      { referencePoints: [from.coords, to.coords], params: { routingMode: 'auto' } },
      { boundsAutoApply: true },
    );

    route.model.events
      .add('requestsuccess', () => {
        const activeRoute = route.getActiveRoute();
        if (!activeRoute) return;

        dispatch(
          setRouteInfo({
            distance: activeRoute.properties.get('distance').text,
            time: activeRoute.properties.get('duration').text,
          }),
        );
      })
      .add('requestfail', () => dispatch(setRouteInfo(null)));

    if (routeRef.current) {
      mapInstance.current.geoObjects.remove(routeRef.current);
    }

    routeRef.current = route;
    mapInstance.current.geoObjects.add(route);
  }, [dispatch, from.coords, to.coords]);

  const handleInputChange = (type: 'from' | 'to') => (value: string) => {
    dispatch(setPoint({ type, point: { address: value, coords: null } }));

    if (ymapsRef.current && value.trim()) {
      dispatch(fetchSuggestions({ query: value, ymaps: ymapsRef.current }));
    }
  };

  const handleInputFocus = (type: 'from' | 'to') => () => {
    dispatch(setActivePoint(type));

    const value = type === 'from' ? from.address : to.address;
    if (ymapsRef.current && value.trim()) {
      dispatch(fetchSuggestions({ query: value, ymaps: ymapsRef.current }));
    }
  };

  const handleInputBlur = (type: 'from' | 'to') => (value: string) => {
    if (!ymapsRef.current) return;
    dispatch(fetchGeocode({ type, query: value, ymaps: ymapsRef.current }));
  };

  const handleSelectSuggestion = (type: 'from' | 'to') => (value: string) => {
    if (!ymapsRef.current) return;
    dispatch(fetchGeocode({ type, query: value, ymaps: ymapsRef.current }));
    dispatch(hideSuggestions());
  };

  return (
    <div className="app">
      <div ref={mapRef} className="map" />

      <section className={'bottom-sheet'}>
        <header>
          <div className="title">Вызов эвакуатора</div>
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
                value={from.address}
                placeholder="Откуда забрать?"
                onFocus={handleInputFocus('from')}
                onChange={(event) => handleInputChange('from')(event.target.value)}
                onBlur={(event) => handleInputBlur('from')(event.target.value)}
                onKeyDown={(event) =>
                  event.key === 'Enter' &&
                  handleSelectSuggestion('from')((event.target as HTMLInputElement).value)
                }
              />
            </label>

            {suggestVisible && suggestions.length > 0 && activePoint === 'from' && (
              <ul className="suggest-list">
                {suggestions.map((item) => (
                  <li
                    key={item.value}
                    onMouseDown={() => handleSelectSuggestion('from')(item.value)}
                  >
                    {item.displayName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="input-wrapper">
            <label className={activePoint === 'to' ? 'active' : ''}>
              Куда
              <input
                value={to.address}
                placeholder="Куда едем?"
                onFocus={handleInputFocus('to')}
                onChange={(event) => handleInputChange('to')(event.target.value)}
                onBlur={(event) => handleInputBlur('to')(event.target.value)}
                onKeyDown={(event) =>
                  event.key === 'Enter' &&
                  handleSelectSuggestion('to')((event.target as HTMLInputElement).value)
                }
              />
            </label>

          </div>
        </div>
            <label 
            className={activePoint === 'from' ? 'active' : ''}
            >
              Комментарий к заказу
              <input
                value={from.address}
                // placeholder="Откуда забрать?"
                onFocus={handleInputFocus('from')}
                onChange={(event) => handleInputChange('from')(event.target.value)}
                onBlur={(event) => handleInputBlur('from')(event.target.value)}
                onKeyDown={(event) =>
                  event.key === 'Enter' &&
                  handleSelectSuggestion('from')((event.target as HTMLInputElement).value)
                }
              />
            </label>

        <footer>
          <button type="button" className="secondary" onClick={() => dispatch(clearRoute())}>
            Очистить
          </button>
          <button type="button" className="primary">
            Заказать
          </button>
        </footer>
      </section>
    </div>
  );
}
