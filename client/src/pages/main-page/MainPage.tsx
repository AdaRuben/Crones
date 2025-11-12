import { useEffect, useRef } from 'react';
import {
  clearRoute,
  hideSuggestions,
  setActivePoint,
  setPoint,
  setRouteInfo,
} from '../../entities/maps/slice/MapSlices';
import { fetchGeocode, fetchSuggestions } from '../../entities/maps/thunks/MapThunks';
import { MAP_CENTER, MOSCOW_BOUNDS, geocodeByCoords } from '../../entities/maps/api/MapApi';
import { useAppDispatch, useAppSelector } from '../../shared/api/hooks';
import OrderForm, {
  type OrderFormSubmitPayload,
} from '../../widgets/new-order-field/NewOrderField';
import './MainPage.css';
import 'antd/dist/reset.css';

export default function MainPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { activePoint, from, to, suggestions, suggestVisible, routeInfo } = useAppSelector(
    (state) => state.map,
  );

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<ymaps.Map | null>(null);
  const routeRef = useRef<ymaps.multiRouter.MultiRoute | null>(null);
  const ymapsRef = useRef<typeof ymaps | null>(null);
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

      type YMapClickEvent = HTMLButtonElement & { get: (key: string) => unknown };

      ymap.events.add('click', (event: YMapClickEvent) => {
        void (async () => {
          const coords = event.get('coords') as [number, number];
          const address = await geocodeByCoords(window.ymaps, coords);
          const pointType = activePointRef.current;

          dispatch(setPoint({ type: pointType, point: { address, coords } }));
          dispatch(setActivePoint(pointType === 'from' ? 'to' : 'from'));
          dispatch(hideSuggestions());
        })();
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
     void dispatch(fetchSuggestions({ query: value, ymaps: ymapsRef.current }));
    }
  };

  const handleInputFocus = (type: 'from' | 'to') => () => {
    dispatch(setActivePoint(type));

    const value = type === 'from' ? from.address : to.address;
    if (ymapsRef.current && value.trim()) {
      void dispatch(fetchSuggestions({ query: value, ymaps: ymapsRef.current }));
    }
  };

  const handleInputBlur = (type: 'from' | 'to') => (value: string) => {
    if (!ymapsRef.current) return;
    void dispatch(fetchGeocode({ type, query: value, ymaps: ymapsRef.current }));
  };

  const handleSelectSuggestion = (type: 'from' | 'to') => (value: string) => {
    if (!ymapsRef.current) return;
    void dispatch(fetchGeocode({ type, query: value, ymaps: ymapsRef.current }));
    dispatch(hideSuggestions());
  };

  const handleOrderSubmit = (payload: OrderFormSubmitPayload): void => {
    // TODO: интеграция с API создания заказа.
    console.log('Submitting order', payload);
  };

  const handleClearRoute = (): void => {
    dispatch(clearRoute());
  };

  return (
    <div className="app">
      <div ref={mapRef} className="map" />
      <OrderForm
        routeInfo={routeInfo}
        fromAddress={from.address}
        toAddress={to.address}
        activePoint={activePoint}
        suggestions={suggestions}
        suggestVisible={suggestVisible}
        onFromChange={handleInputChange('from')}
        onToChange={handleInputChange('to')}
        onFromFocus={handleInputFocus('from')}
        onToFocus={handleInputFocus('to')}
        onFromBlur={handleInputBlur('from')}
        onToBlur={handleInputBlur('to')}
        onFromSelect={handleSelectSuggestion('from')}
        onToSelect={handleSelectSuggestion('to')}
        onClear={handleClearRoute}
        onSubmit={handleOrderSubmit}
      />
    </div>
  );
}
