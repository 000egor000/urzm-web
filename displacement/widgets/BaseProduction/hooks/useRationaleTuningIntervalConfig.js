import { colors } from '../../../../../constants/colors';
import { width } from '../DisplacementCharacteristics/constants';

const useRationaleTuningIntervalConfig = (data, height = 800) => {
  return {
    title: {
      text: '',
    },
    chart: {
      type: 'scatter',
      height: height - 150,
      ...width(height),
    },
    xAxis: {
      lineColor: colors.black,
      gridLineWidth: 1,

      title: {
        text: 'Ln (накопленная добыча жидкости, тыс.т.)',
        align: 'middle',
        textAlign: 'center',
        style: {
          fontWeight: 'bold',
        },
      },
    },
    yAxis: [
      {
        lineColor: colors.black,

        lineWidth: 1,
        title: {
          text: 'Ln (доля нефти, д.ед.)',
          align: 'middle',
          textAlign: 'center',
          style: {
            fontWeight: 'bold',
          },
        },
      },
    ],
    legend: {
      layout: 'horizontal',
      alignColumns: false,
      enabled: false,
    },

    series: [
      {
        showInLegend: true,
        type: 'line',
        name: 'Изменение доли нефти от накопленной добычи жидкости',
        lineColor: colors.blueLight,
        data: data?.oil_liquid,
      },
      {
        showInLegend: true,
        type: 'line',
        name: 'Максимальный период настройки характеристик вытеснения',
        lineColor: colors.red,
        data: data?.period,
      },
    ],
  };
};

export default useRationaleTuningIntervalConfig;
