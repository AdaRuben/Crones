import { useEffect, useRef, useState } from 'react';
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
import type { OrderFormValues } from '../../widgets/new-order-field/NewOrderField';
import OrderForm from '../../widgets/new-order-field/NewOrderField';
import './MainPage.css';
import 'antd/dist/reset.css';
import { newOrderSchema } from '@/entities/orders/types/schema';
import { createOrder } from '@/entities/orders/model/thunks';
import { message } from 'antd';
import CostCalculation from '@/features/cost-calculation/CostCalculation';

type VehicleLocal = 'Седан' | 'Кроссовер' | 'Внедорожник' | null;

export default function MainPage(): React.JSX.Element {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { activePoint, from, to, suggestions, suggestVisible, routeInfo } = useAppSelector(
    (state) => state.map,
  );

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<ymaps.Map | null>(null);
  const routeRef = useRef<ymaps.multiRouter.MultiRoute | null>(null);
  const ymapsRef = useRef<typeof ymaps | null>(null);
  const activePointRef = useRef(activePoint);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocal>(null); 
  const [priceState, setPriceState] = useState<{ loading: boolean; error: string | null; text: string | null }>({ 
    loading: false,
    error: null,
    text: null,
  });

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
      setPriceState({ loading: false, error: null, text: null });
      return;
    }

    const route = new currentYmaps.multiRouter.MultiRoute(
      { referencePoints: [from.coords, to.coords], params: { routingMode: 'auto' } },
      { boundsAutoApply: true },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    route.model.events
      .add('requestsuccess', () => {
        const activeRoute = route.getActiveRoute();
        if (!activeRoute) return;

        dispatch(
          setRouteInfo({
   
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            distance: activeRoute.properties.get('distance').text,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            time: activeRoute.properties.get('duration').text,
          }),
        );
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

  const handleOrderSubmit = async (values: OrderFormValues): Promise<void> => {
    if (!auth.user) {

      message.error('Авторизуйтесь, чтобы оформить заказ');
      return;
    }
    try {
      const orderPayload = newOrderSchema.parse({
        driverId: null,
        from: values.fromAddress.trim(),
        to: values.toAddress.trim(),
        vehicle: values.vehicle,
        status: 'new',
        isPaid: false,
        totalCost: null,
        customerComment: values.comment || undefined,
        adminComment: undefined,
        finishedAt: undefined,
      });
      await dispatch(createOrder(orderPayload)).unwrap();
      setSelectedVehicle(null);
      setPriceState({ loading: false, error: null, text: null })
      message.success('Заказ отправлен');
      dispatch(clearRoute());
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Не удалось создать заказ';
      message.error(text);
    }
  };
  const handleClearRoute = (): void => {
    dispatch(clearRoute());
    setSelectedVehicle(null); 
    setPriceState({ loading: false, error: null, text: null });
  };

  const priceText =
    priceState.error
      ? 'Ошибка расчёта'
      : priceState.loading
      ? 'Рассчитываем стоимость...'
      : priceState.text || undefined;

  return (
    <div className="app">
      <div ref={mapRef} className="map" />

      <CostCalculation
        distance={routeInfo?.distance} 
        vehicle={selectedVehicle} 
        onChange={setPriceState} 
      />

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
        onVehicleChange={setSelectedVehicle}
        priceText={priceText}
      />
    </div>
  );
}
