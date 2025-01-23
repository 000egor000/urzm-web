import React, { useMemo } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import isEqual from 'deep-equal';
import pt from 'prop-types';
import { setHighchartsOptions } from 'utils/functions/setHighchartsOptions';

setHighchartsOptions(Highcharts);

/**
 * Компонент <ColumnChart />
 * @param {Object} props props компонента
 * @param {Function} props.hideSelectedData обработчик скрытия выбранных данных
 * @param {string|number} props.height высота
 * @param {string|number} props.width ширина
 * @param {Object.<string, any>} props.data данные
 * @returns {JSX.Element}
 */
const ColumnChart = ({ hideSelectedData, height, width, data: { data, label, title } }) => {
  /**
   * Конфигурация графика
   */
  const config = useMemo(
    () => ({
      chart: {
        type: 'column',
        height: height,
        width: width,
      },
      title: {
        text: title,
      },
      yAxis: [
        {
          lineColor: 'black',
          lineWidth: 1,
          title: {
            text: label,
            align: 'middle',
            textAlign: 'center',
            style: {
              fontWeight: 'bold',
            },
            startOnTick: true,
            endOnTick: true,
          },
          opposite: false,
        },
      ],
      tooltip: {
        valueDecimals: 2,
        shared: true,
        crosshairs: true,
      },
      navigator: {
        series: {
          type: 'column',
        },
      },
      rangeSelector: {
        enabled: false,
      },
      series: [
        {
          name: title,
          data,
        },
      ],
    }),
    [height, width, label, title, data],
  );

  return (
    <>
      <button
        onClick={() =>
          hideSelectedData({
            data: null,
            toShow: false,
          })
        }
      >
        {'<-'}
      </button>
      <HighchartsReact highcharts={Highcharts} options={config} constructorType="stockChart" />
    </>
  );
};

ColumnChart.propTypes = {
  height: pt.number,
  data: pt.object,
  width: pt.number,
  hideSelectedData: pt.func,
};

export default React.memo(ColumnChart, isEqual);
