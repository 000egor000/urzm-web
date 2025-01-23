export const INIT_DATA_PICKER = { data: [], isLoaded: false };
export const LABEL_ALL = 'Все';
export const VALUE_ALL = -1;

const INIT_FILTER_ITEM_DATA = { id: null, label: '' };

const filterOrder = ['venture', 'workshop', 'field', 'group', 'well', 'gtmId'];

export const getFilterDataWithReset = (field, value) => {
  let reset = false;
  const filterData = filterOrder.reduce((acc, filterName) => {
    if (reset) acc[filterName] = null;
    if (filterName === field) {
      acc[filterName] = value;
      reset = true;
    }

    return acc;
  }, {});

  return filterData;
};

export const getFormatedItemData = el =>
  el ? { ...el, id: el.id, label: el.label || el.title || el.name } : INIT_FILTER_ITEM_DATA;

export const getFormatedData = data => ({
  data: data.map(getFormatedItemData),
  isLoaded: true,
});

export const getFilterValForFetch = val => (val === VALUE_ALL ? null : val);
