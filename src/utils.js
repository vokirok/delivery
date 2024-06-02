export function numProductsInRussian(num) {
  // 0 продуктов
  // 1 продукт
  // 2 продукта
  // 3 продукта
  // 4 продукта
  // 5 продуктов

  switch (num % 10) {
    case 1:
      return `${num} продукт`;
    case 2:
      return `${num} продукта`;
    case 3:
      return `${num} продукта`;
    case 4:
      return `${num} продукта`;
    default:
      return `${num} продуктов`;
  }
}
