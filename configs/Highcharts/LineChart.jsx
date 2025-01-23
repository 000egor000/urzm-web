import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import pt from 'prop-types';
import isEqual from 'deep-equal';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getChartData } from 'store/selectors/home/chart';
import { createSeries } from 'utils/functions';
import { setHighchartsOptions } from 'utils/functions/setHighchartsOptions';

setHighchartsOptions(Highcharts);

/**
 * Компонент <LineChart />
 * @param {Object} props props компонента
 * @param {Function} props.clickCallback callback срабатывает при клике
 * @param {string|number} props.height высота
 * @param {string|number} props.width ширина
 * @param {Function} props.showSelectedData функция отображает выбранные данные
 * @returns {JSX.Element}
 */
const LineChart = ({ clickCallback, height, width, showSelectedData }) => {
  const chartData = useSelector(getChartData);
  /**
   * Данные графика
   */
  const data = useMemo(() => {
    const keys = Object.keys(chartData);
    keys.sort();
    return keys.reduce(
      (
        {
          waterCut,
          fluidProduction,
          oilProduction,
          waterInjection,
          countOfProductionWells,
          countOfInjectionWells,
          currentCompensation,
          accumulatedCompensation,
        },
        el,
      ) => {
        const newKey = +new Date(el);
        return {
          waterCut: [...(waterCut || []), [newKey, chartData[el].waterCut]],
          fluidProduction: [...(fluidProduction || []), [newKey, chartData[el].fluidProduction]],
          oilProduction: [...(oilProduction || []), [newKey, chartData[el].oilProduction]],
          waterInjection: [...(waterInjection || []), [newKey, chartData[el].waterInjection]],
          countOfProductionWells: [
            ...(countOfProductionWells || []),
            [newKey, chartData[el].countOfProductionWells],
          ],
          countOfInjectionWells: [
            ...(countOfInjectionWells || []),
            [newKey, chartData[el].countOfInjectionWells],
          ],
          currentCompensation: [
            ...(currentCompensation || []),
            [newKey, chartData[el].currentCompensation],
          ],
          accumulatedCompensation: [
            ...(accumulatedCompensation || []),
            [newKey, chartData[el].accumulatedCompensation],
          ],
        };
      },
      {},
    );
    // return {
    //   waterCut: keys.map(key => [+new Date(key), chartData[key].waterCut]),
    //   fluidProduction: keys.map(key => [key, chartData[key].fluidProduction]),
    //   oilProduction: keys.map(key => [key, chartData[key].oilProduction]),
    //   waterInjection: keys.map(key => [key, chartData[key].waterInjection]),
    //   countOfProductionWells: keys.map(key => [key, chartData[key].countOfProductionWells]),
    //   countOfInjectionWells: keys.map(key => [key, chartData[key].countOfInjectionWells]),
    //   currentCompensation: keys.map(key => [key, chartData[key].currentCompensation]),
    //   accumulatedCompensation: keys.map(key => [key, chartData[key].accumulatedCompensation]),
    // };
  }, [chartData]);
  // const serializeData = (accumulator, item) => {
  //   for (const key in item) {
  //     accumulator.hasOwnProperty(key)
  //       ? accumulator[key].push(+Number(item[key]).toFixed(1))
  //       : (accumulator[key] = [+Number(item[key]).toFixed(1)]);
  //   }
  //   return accumulator;
  // };
  //
  // const xAxisData = Object.keys(chartData).length ? Object.keys(chartData).map(Date.parse) : [];
  // const yAxisData = Object.keys(chartData).length
  //   ? Object.values(chartData).reduce(serializeData, {})
  //   : [];

  /**
   * Конфигурация графика
   */
  const config = useMemo(
    () => ({
      chart: {
        type: 'area',
        height: height,
        width: width,
      },
      tooltip: {
        valueDecimals: 2,
        split: true,
        distance: 20,
        padding: 3,
        style: {
          whiteSpace: 'wrap',
        },
      },
      yAxis: [
        {
          lineColor: 'black',
          lineWidth: 1,
          title: {
            text: 'т, шт, м2',
            align: 'middle',
            textAlign: 'center',
            style: {
              fontWeight: 'bold',
            },
          },
          opposite: false,
        },
        {
          lineColor: 'black',
          lineWidth: 1,
          title: {
            text: 'Обводненость, %',
            align: 'middle',
            textAlign: 'center',
            rotation: 270,
            style: {
              fontWeight: 'bold',
            },
            x: 5,
          },
        },
        {
          labels: {
            enabled: false,
          },
          opposite: false,
        },
      ],
      plotOptions: {
        series: {
          events: {
            click: function () {
              showSelectedData({
                data: {
                  data: this.data.map(({ x, y }) => [x, y]),
                  label: this.yAxis.options.title.text,
                  title: this.name,
                },
                toShow: true,
              });
            },
          },
          step: 'center',
          cursor: 'pointer',
          fillOpacity: 0,
          lineWidth: 1.2,
        },
      },
      navigator: {
        xAxis: {
          labels: {
            style: {
              color: 'white',
              fontWeight: 'bold',
              textShadow: '1px 1px 0px rgba(0, 0, 0, 1)',
            },
          },
        },
        series: {
          type: 'area',
          fillOpacity: 1,
          color: 'dimgrey',
        },
      },
      rangeSelector: {
        enabled: false,
      },
      legend: {
        enabled: true,
        layout: 'horizontal',
        alignColumns: false,
      },
      series: [
        createSeries('Обводненность (МЭР) (%)', data.waterCut, 1),
        createSeries('Добыча нефти (МЭР) (т)', data.oilProduction, 0),
        createSeries(
          'Колличество действующих добывающих скважин (шт)',
          data.countOfProductionWells,
          2,
        ),
        createSeries(
          'Колличество действующих нагнетательных скважин (шт)',
          data.countOfInjectionWells,
          2,
        ),
        createSeries('Добыча жидкости (МЭР) (т)', data.fluidProduction, 0),
        createSeries('Закачка воды (МЭР) (т)', data.waterInjection, 0),
        createSeries('Текущая компенсация (%)', data.currentCompensation, 1),
        createSeries('Накопленная компенсация (%)', data.accumulatedCompensation, 1),
      ],
    }),
    [height, width, showSelectedData, data],
  );

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={config} constructorType="stockChart" />
    </>
  );
};

LineChart.propTypes = {
  clickCallback: pt.func,
  height: pt.number,
  width: pt.number,
  showSelectedData: pt.func.isRequired,
};

export default React.memo(LineChart, isEqual);
