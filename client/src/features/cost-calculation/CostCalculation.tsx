import { useEffect } from 'react';
import axiosInstance from '@/shared/axiosInstance';

type VehicleType = 'Кроссовер' | 'Седан' | 'Внедорожник' | null;

type Props = {
  distance?: string | null;
  vehicle: VehicleType;
  onChange: (state: { loading: boolean; error: string | null; text: string | null }) => void;
};

export default function CostCalculation({ distance, vehicle, onChange }: Props): React.JSX.Element | null {
  useEffect(() => {
    if (!distance || !vehicle) {
      onChange({ loading: false, error: null, text: null });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        onChange({ loading: true, error: null, text: null });

        const mappedType = vehicle === 'Внедорожник' ? 'Внедорожник' : 'Седан/Кроссовер';
        const messageText = `Дистанция: ${distance}. Тип авто: ${mappedType}.`;

        const { data } = await axiosInstance.post<string>(
          '/chat',
          { message: messageText },
          { signal: controller.signal },
        );

        onChange({ loading: false, error: null, text: typeof data === 'string' ? data : null });
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          onChange({ loading: false, error: 'Не удалось рассчитать цену', text: null });
        }
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [distance, vehicle, onChange]);

  return null;
}