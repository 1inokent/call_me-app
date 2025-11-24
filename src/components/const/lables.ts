const LABLES = ['Контрагент (поиск по телефону)','Счёт поступления', 'Склад отгрузки', 'Организация', 'Тип цены', 'Поиск товара'];
const getOptions = (items: any[]) => {
    if (!Array.isArray(items)) return [];
  
    return items.map(item => ({
      value: item.id,
      label: item.name ?? item.title ?? `#${item.id}`
    }));
  };

export { getOptions, LABLES };
