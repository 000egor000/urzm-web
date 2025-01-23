import React from 'react';
import EditableRadio from 'shared/Table/EditableRadio/index';

/**
 * Конфигурация колонок таблицы
 */
export const getColumns = () => [
  {
    Header: 'Количество месяцев в периоде настройки',
    accessor: 'setting_period_count',
    width: 150,
  },
  {
    Header: 'Коэффициент аппроксимации',
    accessor: 'approximation_factor',
    width: 150,
  },
  {
    Header: 'Коэффициент детерминации',
    accessor: 'determination_factor',
    width: 150,
  },
  {
    Header: 'Критерий Тейла',
    accessor: 'theil_criterion',
    width: 150,
  },
  {
    Header: 'Подвижные запасы, тыс. т.',
    accessor: 'mobile_reserves',
    width: 150,
  },
  {
    Header: 'Извлекаемые запасы, тыс. т.',
    accessor: 'recoverable_reserves',
    width: 150,
  },

  {
    Header: 'Принять',
    accessor: 'accept',
    Cell: cell => <EditableRadio cell={cell} />,
    width: 150,
  },
];
