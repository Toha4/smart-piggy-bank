export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Удаляем все символы, кроме цифр, точки и запятой
  const numericValue = value.replace(/[^\d.,]/g, '');
  // Заменяем запятую на точку для корректного парсинга
  const normalizedValue = numericValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
};