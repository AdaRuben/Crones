import { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
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
import 'antd/dist/reset.css';

export default function MainPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { activePoint, from, to, suggestions, suggestVisible, routeInfo } = useAppSelector(
    (state) => state.map,
  );

  const [vehicle, setVehicle] = useState<'Кроссовер' | 'Седан' | null>(null);
  const [comment, setComment] = useState('');

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

        <Form className="form">
          <div className="form-field">
            <label>Откуда</label>
            <Input
              placeholder="Откуда забрать?"
              value={from.address}
              onChange={(e) => handleInputChange('from')(e.target.value)}
              onFocus={handleInputFocus('from')}
              onBlur={(e) => handleInputBlur('from')(e.target.value)}
              onPressEnter={(e) =>
                handleSelectSuggestion('from')((e.target as HTMLInputElement).value)
              }
              className={activePoint === 'from' ? 'active' : ''}
            />
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

          <div className="form-field">
            <label>Куда</label>
            <Input
              placeholder="Куда едем?"
              value={to.address}
              onChange={(e) => handleInputChange('to')(e.target.value)}
              onFocus={handleInputFocus('to')}
              onBlur={(e) => handleInputBlur('to')(e.target.value)}
              onPressEnter={(e) =>
                handleSelectSuggestion('to')((e.target as HTMLInputElement).value)
              }
              className={activePoint === 'to' ? 'active' : ''}
            />
            {suggestVisible && suggestions.length > 0 && activePoint === 'to' && (
              <ul className="suggest-list">
                {suggestions.map((item) => (
                  <li key={item.value} onMouseDown={() => handleSelectSuggestion('to')(item.value)}>
                    {item.displayName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-field">
            <label>Тип транспорта</label>
            <Select
              placeholder="Выберите тип транспорта"
              value={vehicle}
              onChange={(value) => setVehicle(value)}
              options={[
                { value: 'Кроссовер', label: 'Кроссовер' },
                { value: 'Седан', label: 'Седан' },
              ]}
              allowClear
              className={vehicle ? 'active' : ''}
            />
          </div>

          <div className="form-field">
            <label>Комментарий к заказу</label>
            <Input
              placeholder="Ваш комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <footer>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                dispatch(clearRoute());
                setVehicle(null);
                setComment('');
              }}
            >
              Очистить
            </button>
            <button type="submit" className="primary">
              Заказать
            </button>
          </footer>
        </Form>
      </section>
    </div>
  );
}
