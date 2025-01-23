import {
  yAxisLines,
  valueArray,
  width,
  generationPlotLines,
  generationPlotLinesIdLegend,
} from '../DisplacementCharacteristics/constants';

import { colors } from '../../../../../constants/colors';

const useCumulativeProductionConfig = (data, dataSetting, height = 800) => {
  const initData = data?.coordinates_accumulated_displacement_characteristic
    ? data?.coordinates_accumulated_displacement_characteristic
    : dataSetting?.coordinates_accumulated_displacement_characteristic;

  if (initData) {
    const generation = initData?.setting_all
      ? initData?.setting_all.map(el => {
          return {
            showInLegend: true,
            type: 'line',
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            name: el?.name,
            dashStyle: 'dash',
            data: valueArray(el?.curve),
            yAxis: yAxisLines(el?.name),
            marker: {
              enabled: false,
            },
          };
        })
      : [];

    const getGenerationPlotLinesIdLegend = generationPlotLinesIdLegend(initData);

    return {
      title: {
        text: '',
      },
      chart: {
        type: 'scatter',
        height: height - 40,
        ...width(height),
      },

      xAxis: {
        crosshair: false,
        type: 'datetime',

        plotLines: generationPlotLines(initData),
      },

      yAxis: [
        {
          title: {
            text: 'Накопленная добыча нефти, тыс.т',
          },
          labels: {
            format: '{value}',
          },
        },
        {
          title: { text: 'Обводненность, %' },
          labels: {
            format: '{value}',
          },

          opposite: true,
        },
        {
          title: { text: 'Накопленная добыча жидкости, тыс.т' },
          labels: {
            format: '{value}',
          },

          opposite: true,
        },
      ],
      series: [
        {
          showInLegend: true,
          type: 'line',
          color: colors.red,
          name: initData?.oil_fact_list?.name,
          yAxis: 0,
          tooltip: {
            valueSuffix: ' т/накоп.',
          },
          data: valueArray(initData?.oil_fact_list?.curve),
          marker: {
            enabled: false,
          },
        },
        {
          showInLegend: true,
          type: 'line',
          color: colors.gray,
          name: initData?.water_pumping_fact_list?.name,
          yAxis: 0,
          tooltip: {
            valueSuffix: ' тыс.т/сут.',
          },
          data: valueArray(initData?.water_pumping_fact_list?.curve),
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          color: colors.gray,
          name: initData?.water_pumping_forecast_list?.name,
          yAxis: 0,
          tooltip: {
            valueSuffix: ' тыс.т/сут.',
          },
          data: valueArray(initData?.water_pumping_forecast_list?.curve),
          dashStyle: 'dash',
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          color: colors.green,
          name: initData?.liquid_fact_list?.name,
          data: valueArray(initData?.liquid_fact_list?.curve),
          yAxis: 2,
          tooltip: {
            valueSuffix: ' тыс.т/сут.',
          },
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          color: colors.blue,
          name: initData?.water_fact_list?.name,
          yAxis: 1,

          tooltip: {
            valueSuffix: ' %',
          },
          data: valueArray(initData?.water_fact_list?.curve),
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          opacity: 0.5,
          color: colors.red,
          name: initData?.oil_forecast_list?.name,
          data: valueArray(initData?.oil_forecast_list?.curve),
          dashStyle: 'dash',
          yAxis: 0,
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          opacity: 0.5,
          color: colors.green,
          name: initData?.liquid_forecast_list?.name,
          dashStyle: 'dash',
          yAxis: 2,
          data: valueArray(initData?.liquid_forecast_list?.curve),
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          opacity: 0.5,
          color: colors.blue,
          name: initData?.water_forecast_list?.name,
          data: valueArray(initData?.water_forecast_list?.curve),
          dashStyle: 'dash',
          yAxis: 1,
          marker: {
            enabled: false,
          },
        },

        ...generation,
        ...getGenerationPlotLinesIdLegend,
      ],
    };
  }
};

export default useCumulativeProductionConfig;
