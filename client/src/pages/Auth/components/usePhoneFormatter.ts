// client/src/pages/Auth/hooks/usePhoneFormatter.ts
import { useCallback } from 'react';

export default function usePhoneFormatter(): {
  formatPhone: (value: string) => string;
  handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} {
  const formatPhone = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '+7 ';
    if (!digits.startsWith('7')) return '+7 ';
    const rest = digits.slice(1);
    const match = /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/.exec(rest);
    if (!match) return `+7 ${rest}`;
    return `+7 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`.trim();
  }, []);

  const handlePhoneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(event.target.value);
      event.target.value = formatted;
    },
    [formatPhone],
  );

  return { formatPhone, handlePhoneChange };
}
