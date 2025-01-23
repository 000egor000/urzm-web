import moment from 'moment';
import { colors } from '../../../../../constants/colors';

export const INIT_DATA_PICKER = { data: [], isLoaded: false };
export const LABEL_ALL = 'Все';
export const VALUE_ALL = -1;

const INIT_FILTER_ITEM_DATA = { id: null, label: '' };

export const columnsForStatistics = [
  {
    name: 'Количество месяцев в периоде настройки',
    accessor: 'setting_period_count',
    parent: null,
  },
  {
    name: 'Коэффициент аппроксимации',
    accessor: 'approximation_factor',
    parent: null,
  },
  {
    name: 'Коэффициент детерминации',
    accessor: 'determination_factor',
    parent: null,
  },
  {
    name: 'Критерий Тейла',
    accessor: 'theil_criterion',
    parent: null,
  },
  {
    name: 'Подвижные запасы, тыс. т.',
    accessor: 'mobile_reserves',
    parent: null,
  },
  {
    name: 'Извлекаемые запасы, тыс. т.',
    accessor: 'recoverable_reserves',
    parent: null,
  },
  {
    name: 'Принять',
    accessor: 'accept',
    parent: null,
  },
];

export const columnsForTuningInterval = [
  {
    name: 'НГДО',
    accessor: 'workshop_name',
    parent: {
      name: 'Данные по фильтру',
      accessor: 'field1',
    },
  },
  {
    name: 'Месторождение',
    accessor: 'ventures_name',
    parent: {
      name: 'Данные по фильтру',
      accessor: 'field1',
    },
  },
  {
    name: 'ЦДНГ',
    accessor: 'field_name',
    parent: {
      name: 'Данные по фильтру',
      accessor: 'field1',
    },
  },
  {
    name: 'Группа скважин',
    accessor: 'group_well_name',
    parent: {
      name: 'Данные по фильтру',
      accessor: 'field1',
    },
  },

  {
    name: 'c',
    accessor: 'settings_interval_start',
    parent: {
      name: 'Период',
      accessor: 'field2',
    },
  },

  {
    name: 'по',
    accessor: 'settings_interval_end',
    parent: {
      name: 'Период',
      accessor: 'field2',
    },
  },

  {
    name: 'по',
    accessor: 'trend_start',
    parent: {
      name: 'Тренд',
      accessor: 'field3',
    },
  },
  {
    name: 'по',
    accessor: 'trend_end',
    parent: {
      name: 'Тренд',
      accessor: 'field3',
    },
  },

  {
    name: 'Кол-во месяцев тренда',
    accessor: 'trend_months',
    parent: null,
  },
  {
    name: 'Коэффициент детерминации',
    accessor: 'determination_factor',
    parent: null,
  },
];

export const columnsForCharacteristics = [
  {
    name: 'Показывать на графике',
    accessor: 'show_on_chart',
    parent: {
      name: 'Уравнение',
      accessor: 'field1',
    },
  },
  {
    name: 'Использовать для осреднения',
    accessor: 'use_for_averaging',
    parent: {
      name: 'Уравнение',
      accessor: 'field1',
    },
  },
  {
    name: 'Подсадка',
    accessor: 'replanting',
    parent: {
      name: 'Уравнение',
      accessor: 'field1',
    },
  },
  {
    name: 'Название для функции',
    accessor: 'algorithm',
    parent: {
      name: 'Уравнение',
      accessor: 'field1',
    },
  },
  {
    name: 'Начало',
    accessor: 'setting_interval_start',
    parent: {
      name: 'Период настройки',
      accessor: 'field2',
    },
  },
  {
    name: 'Конец',
    accessor: 'setting_interval_end',
    parent: {
      name: 'Период настройки',
      accessor: 'field2',
    },
  },
  {
    name: 'Кол-во мес.',
    accessor: 'number_months_setting',
    parent: {
      name: 'Период настройки',
      accessor: 'field2',
    },
  },
  {
    name: 'Начало',
    accessor: 'forecast_interval_start',
    parent: {
      name: 'Период прогноза',
      accessor: 'field3',
    },
  },
  {
    name: 'Конец',
    accessor: 'forecast_interval_end',
    parent: {
      name: 'Период прогноза',
      accessor: 'field3',
    },
  },
  {
    name: 'Коэф. аппроксимации',
    accessor: 'approximation_factor',
    parent: {
      name: 'Статистика',
      accessor: 'field4',
    },
  },
  {
    name: 'Коэф. детерминации',
    accessor: 'determination_factor',
    parent: {
      name: 'Статистика',
      accessor: 'field4',
    },
  },
  {
    name: 'Критерий Тейла',
    accessor: 'tail_criterion',
    parent: {
      name: 'Статистика',
      accessor: 'field4',
    },
  },
  {
    name: 'Отклонение',
    accessor: 'relative_deviation',
    parent: {
      name: 'Статистика',
      accessor: 'field4',
    },
  },
  {
    name: 'Остаточные извлекаемые запасы, тыс. т.',
    accessor: 'residual_reserves',
    parent: {
      name: 'Запасы',
      accessor: 'field5',
    },
  },
  {
    name: 'Кратность запасов, лет',
    accessor: 'multiplicity_reserves',
    parent: {
      name: 'Запасы',
      accessor: 'field5',
    },
  },
  {
    name: 'Извлекаемые запасы, тыс. т.',
    accessor: 'recoverable_reserves',
    parent: {
      name: 'Запасы',
      accessor: 'field5',
    },
  },
  {
    name: 'Подвижные запасы, тыс. т.',
    accessor: 'moving_reserves',
    parent: {
      name: 'Запасы',
      accessor: 'field5',
    },
  },
];

export const columnsForWellFond = [
  {
    name: 'Дата',
    accessor: 'date',
    parent: null,
  },
  {
    name: 'Суточная добыча нефти, т/сут',
    accessor: 'daily_oil',
    parent: null,
  },
  {
    name: 'Суточная добыча жидкости, т/сут',
    accessor: 'daily_liquid',
    parent: null,
  },
  {
    name: 'Действующий добывающий фонд, ед.',
    accessor: 'production_fond',
    parent: null,
  },
  {
    name: 'Действующий нагнетательный фонд, ед.',
    accessor: 'injection_fond',
    parent: null,
  },
];

const nameLines = ['добыча жидкости', 'добыча нефти', 'обводненность', 'накопленная закачка'];
const statistics = '(статистика)';

const arrayNameСharacteristics = {
  Камбаров: 'Камбаров',
  'Назаров - Сипачев': 'Назаров-Сипачев',
  Пирвердян: 'Пирвердян',
  Сазонов: 'Сазонов',
  'Сипачев – Посевич': 'Сипачев–Посевич',
  'Французский нефтяной институт': 'Франц.нефт.инст.',
  'Гайсин – Тимашев': 'Гайсин–Тимашев',
  Гайсин: 'Гайсин',
  Абызбаев: 'Абызбаев',
  'Островский - Джапаров': 'Островский-Джапаров',
  'Сипачев – Посевич (мод)': 'Сипачев–Пос.(мод)',
  'Постоянное нефтесодержание': 'Постоянное нефт.',
  'Ревенко (1)': 'Ревенко (1)',
  'Ревенко (2)': 'Ревенко (2)',
  'Темпы падения(1) e((t - b) : a)': 'Темпы падения(1)',
  'Темпы падения(2) e(ln(t) - b) : a)': 'Темпы падения(2)',
  'Темпы падения(3) a : (t - b)': 'Темпы падения(3)',
  'Темпы падения(4) n : (a - b * t)': 'Темпы падения(4)',
  'Темпы падения(5) b + a * ln(t)': 'Темпы падения(5)',
};

export const titleName = val => arrayNameСharacteristics[val] + statistics;

export const waterInjection = 'закачка воды';

export const getDateOfDownload = date => {
  const d = date || new Date();
  return d.toLocaleDateString() + '_' + d.toLocaleTimeString();
};

const title =
  'Формализации процессов выбора лучшего решения при обосновании базовых показателей разработки';

export const fileName = `${title}, Дата_выгрузки_${getDateOfDownload()}.xls`.replace(/:/gi, '-');

export const forecastData = [
  {
    id: '1',
    label: 'Среднее за последние 3 мес.',
  },
  {
    id: '2',
    label: 'Последнее ненулевое значение',
  },
  {
    id: '3',
    label: 'Последнее ненулевое за период настройки',
  },
  {
    id: '4',
    label: 'Константа',
  },
];

//  значение 4, для сверки данных в поле, при выбранном пользователем "константа"
export const constantForecast = '4';

export const getFormatedItemData = el =>
  el ? { ...el, id: el.id, label: el.label || el.title || el.name } : INIT_FILTER_ITEM_DATA;

export const getFormatedData = data => ({
  data: data.map(getFormatedItemData),
  isLoaded: true,
});

export const formatСasting = (data, dataTable, currentRadio) => {
  const getFormat = val =>
    val &&
    Object.fromEntries(
      Object.entries(val).map(el => {
        el[1].map(item => {
          for (const key in item) {
            item[key] = item[key] === 'NaN' ? '-' : item[key];

            item.accept =
              item?.setting_period_count === currentRadio?.useIput?.setting_period_count &&
              item?.characteristic === currentRadio?.useIput?.characteristic;
          }

          return item;
        });
        return el;
      }),
    );

  return {
    ...data,
    displacement_characteristic_table: dataTable,
    displacement_characteristic_area_stat_map: getFormat(
      data?.displacement_characteristic_area_stat_map,
    ),
  };
};

export const yAxisLines = val => {
  let res = 0;

  if (String(val)?.indexOf(nameLines[0]) !== -1) res = 2;
  else if (String(val)?.indexOf(nameLines[2]) !== -1) res = 1;

  return res;
};
export const valueArray = val => val?.map(el => Object.values(el));

export const controlInput = (oldValue, newValue) => +newValue >= 4 && +newValue <= 36;

export const startDataForm = {
  liquidProduction: '1',
  liquidProductionValue: '',
  minimumTesting: '4',
  maximumTesting: '24',
  pumpingDaily: '1',
  pumpingDailyValue: '',
  startDate: null,
  endDate: null,
  approximation: '0.05',
  determination: '0.8',
  deviation: '',
  moving: '',
  useMoving: false,
  useDeviation: false,
};

export const formValueDefault = {
  startDate: '1971-01-01',
  endDate: '1971-01-01',
  trendStartDate: '1971-01-01',
  trendEndDate: '1971-01-01',
  determinationFactor: 0.0,
  trendMonths: 0,
};

export const width = height => (height === 800 ? { width: 800 } : {});

export const notNun = val =>
  val?.map(el => {
    for (const key in el) {
      if (el[key] === '-') {
        el[key] = 'NaN';
      }
    }
    return el;
  });

export const formatData = 'YYYY-MM-DD';

export const generationPlotLines = val => [
  {
    color: colors.blue,
    id: 'setting_start',
    width: 2,
    value: val?.setting_start,
    dashStyle: 'line',
    label: {
      text: moment(val?.setting_start).format('DD.MM.YYYY'),
      align: 'left',
      rotation: 90,
    },
  },
  {
    color: colors.green,
    width: 2,
    value: val?.setting_end,
    id: 'setting_end',
    label: {
      text: moment(val?.setting_end).format('DD.MM.YYYY'),
      align: 'left',
      rotation: 90,
    },
  },
  {
    color: colors.red,
    width: 2,
    value: val?.forecast_start,
    id: 'forecast_start',
    label: {
      text: moment(val?.forecast_start).format('DD.MM.YYYY'),
      align: 'left',
      rotation: 90,
    },
  },

  {
    color: colors.black,
    width: 2,
    value: val?.forecast_end,
    id: 'forecast_end',
    label: {
      text: moment(val?.forecast_end).format('DD.MM.YYYY'),
      align: 'left',
      rotation: 90,
    },
  },
];
export const generationPlotLinesIdLegend = val => [
  {
    showInLegend: true,
    type: 'line',
    opacity: 0.5,
    color: colors.blue,
    name: 'Дата начала настройки характеристики',

    marker: {
      enabled: false,
    },
    events: {
      legendItemClick: function (e) {
        if (this.visible) {
          this.chart.xAxis[0].removePlotLine('setting_start');
        } else {
          this.chart.xAxis[0].addPlotLine({
            color: colors.blue,
            id: 'setting_start',
            width: 2,
            value: val?.setting_start,

            label: {
              text: moment(val?.setting_start).format('DD.MM.YYYY'),
              align: 'left',
              rotation: 90,
            },
          });
        }
      },
    },
  },
  {
    showInLegend: true,
    type: 'line',
    opacity: 0.5,
    color: colors.green,
    name: 'Дата начала настройки характеристики',

    marker: {
      enabled: false,
    },

    events: {
      legendItemClick: function (e) {
        if (this.visible) {
          this.chart.xAxis[0].removePlotLine('setting_end');
        } else {
          this.chart.xAxis[0].addPlotLine({
            color: colors.green,
            width: 2,
            value: val?.setting_end,
            id: 'setting_end',

            label: {
              text: moment(val?.setting_end).format('DD.MM.YYYY'),
              align: 'left',
              rotation: 90,
            },
          });
        }
      },
    },
  },
  {
    showInLegend: true,
    type: 'line',
    opacity: 0.5,
    color: colors.red,
    name: 'Дата начала базовых показателей характеристике вытеснения',

    marker: {
      enabled: false,
    },
    events: {
      legendItemClick: function (e) {
        if (this.visible) {
          this.chart.xAxis[0].removePlotLine('forecast_start');
        } else {
          this.chart.xAxis[0].addPlotLine({
            color: colors.red,
            width: 2,
            value: val?.forecast_start,
            id: 'forecast_start',
            label: {
              text: moment(val?.forecast_start).format('DD.MM.YYYY'),
              align: 'left',
              rotation: 90,
            },
          });
        }
      },
    },
  },

  {
    showInLegend: true,
    type: 'line',
    opacity: 0.5,
    color: colors.black,
    name: 'Дата окончания базовых показателей по выбранной характеристике вытеснения',

    marker: {
      enabled: false,
    },

    events: {
      legendItemClick: function (e) {
        if (this.visible) {
          this.chart.xAxis[0].removePlotLine('forecast_end');
        } else {
          this.chart.xAxis[0].addPlotLine({
            color: colors.black,
            width: 2,
            value: val?.forecast_end,
            id: 'forecast_end',
            label: {
              text: moment(val?.forecast_end).format('DD.MM.YYYY'),
              align: 'left',
              rotation: 90,
            },
          });
        }
      },
    },
  },
];

export const errorBlock = (statusSecond, statusThird) =>
  statusSecond?.error?.description
    ? statusSecond.error.description
    : statusThird?.error?.description;
