import React from 'react';
import EditableCheckbox from 'shared/Table/EditableCheckbox/index';
import EditableDate from 'shared/Table/EditableDate/index';
import EditableCellGtm from 'shared/Table/EditableCellGtm/index';

import { isEmptyOrPositiveNumber } from 'utils/functions/regExp';
export const rules = [
  [val => isEmptyOrPositiveNumber(val), 'Разрешен ввод только числовых значений'],
];

export const getColumns = () => [
  {
    Header: 'Уравнение',
    accessor: 'field1',
    disableSortBy: true,
    columns: [
      {
        Header: 'Показывать на графике',
        Cell: cell => <EditableCheckbox cell={cell} />,
        width: 150,
        accessor: 'show_on_chart',
      },

      {
        Header: 'Использовать для осреднения',
        Cell: cell => <EditableCheckbox cell={cell} />,
        width: 150,
        accessor: 'use_for_averaging',
      },
      {
        Header: 'Подсадка',
        Cell: cell => <EditableCheckbox cell={cell} />,
        width: 150,
        accessor: 'replanting',
      },
      {
        Header: 'Название для функции',
        width: 150,
        accessor: 'algorithm',
      },
    ],
  },

  {
    Header: 'Период настройки',
    accessor: 'field2',
    disableSortBy: true,
    columns: [
      {
        Header: 'Начало',
        width: 150,
        accessor: 'setting_interval_start',
      },
      {
        Header: 'Конец',
        width: 150,
        accessor: 'setting_interval_end',

        Cell: cell => <EditableDate {...cell} rules={rules} type="date" format="YYYY-MM-DD" />,
      },
      {
        Header: 'Кол-во мес.',
        width: 150,
        accessor: 'number_months_setting',
        Cell: cell => <EditableCellGtm {...cell} rules={rules} />,
      },
    ],
  },

  {
    Header: 'Период прогноза',
    accessor: 'field3',
    disableSortBy: true,
    columns: [
      {
        Header: 'Начало',
        width: 150,
        accessor: 'forecast_interval_start',
        Cell: cell => <EditableDate {...cell} rules={rules} type="date" format="YYYY-MM-DD" />,
      },
      {
        Header: 'Конец',
        width: 150,
        accessor: 'forecast_interval_end',
        Cell: cell => <EditableDate {...cell} rules={rules} type="date" format="YYYY-MM-DD" />,
      },
    ],
  },

  {
    Header: 'Статистика',
    accessor: 'field4',
    disableSortBy: true,
    columns: [
      {
        Header: 'Коэф. аппроксимации',
        width: 150,
        accessor: 'approximation_factor',
      },
      {
        Header: 'Коэф. детерминации',
        width: 150,
        accessor: 'determination_factor',
      },
      {
        Header: 'Критерий Тейла',
        width: 150,
        accessor: 'tail_criterion',
      },
      {
        Header: 'Отклонение',
        width: 150,
        accessor: 'relative_deviation',
      },
    ],
  },

  {
    Header: 'Запасы',
    accessor: 'field5',
    disableSortBy: true,
    columns: [
      {
        Header: `Остаточные извлекаемые запасы, тыс. т.`,
        width: 150,
        accessor: 'residual_reserves',
      },
      {
        Header: 'Кратность запасов, лет',
        width: 150,
        accessor: 'multiplicity_reserves',
      },
      {
        Header: 'Извлекаемые запасы, тыс. т.',
        width: 150,
        accessor: 'recoverable_reserves',
      },
      {
        Header: 'Подвижные запасы, тыс. т.',
        width: 150,
        accessor: 'moving_reserves',
      },
    ],
  },
];
