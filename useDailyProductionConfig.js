import {
  waterInjection,
  valueArray,
  width,
  generationPlotLines,
  generationPlotLinesIdLegend,
} from '../DisplacementCharacteristics/constants';
import { colors } from '../../../../../constants/colors';

const useDailyProductionConfig = (data, dataSetting, height = 800) => {
  const initData = data?.coordinates_daily_displacement_characteristic
    ? data?.coordinates_daily_displacement_characteristic
    : dataSetting?.coordinates_daily_displacement_characteristic;

  if (initData) {
    const generation =
      initData?.setting_all?.length > 0
        ? initData?.setting_all
            .filter(el => el?.name.indexOf(waterInjection) !== -1)
            .map(el => {
              return {
                showInLegend: true,
                type: 'line',
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                name: el?.name,
                yAxis: 0,
                dashStyle: 'dash',
                data: valueArray(el?.curve),
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
            text: 'Суточная закачка воды, т/сут.',
          },
          labels: {
            format: '{value}',
          },
        },
      ],
      series: [
        {
          showInLegend: true,
          type: 'line',
          color: colors.red,
          name: initData?.water_pumping_fact_list?.name,
          yAxis: 0,
          tooltip: {
            valueSuffix: ' т/сут.',
          },
          data: valueArray(initData?.water_pumping_fact_list?.curve),
          marker: {
            enabled: false,
          },
        },

        {
          showInLegend: true,
          type: 'line',
          color: colors.red,
          name: initData?.water_pumping_forecast_list?.name,
          data: valueArray(initData?.water_pumping_forecast_list?.curve),
          dashStyle: 'dash',
          yAxis: 0,
          tooltip: {
            valueSuffix: ' т/сут.',
          },
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

export default useDailyProductionConfig;
