import React, { useCallback, useState } from 'react';
import isEqual from 'deep-equal';
import pt from 'prop-types';
import LineChart from 'configs/Highcharts/LineChart';
import ColumnChart from 'configs/Highcharts/ColumnChart';

/**
 * Компонент <Highchart />
 * @param {Object} props props компонента
 * @param {string|number} props.height высота
 * @param {string|number} props.width ширина
 * @returns {JSX.Element}
 */
const Highchart = ({ height, width }) => {
  const [isFullData, showFullData] = useState({ data: null, toShow: false });
  /**
   * Обработчик отображает полные данные
   * @param {Object} obj
   */
  const showFullDataHandler = useCallback(obj => showFullData(obj), [showFullData]);

  return (
    <>
      {isFullData.toShow ? (
        <ColumnChart
          hideSelectedData={showFullDataHandler}
          data={isFullData.data}
          height={height}
          width={width}
        />
      ) : (
        <LineChart showSelectedData={showFullDataHandler} height={height} width={width} />
      )}
    </>
  );
};

Highchart.propTypes = {
  height: pt.number,
  width: pt.number,
};

export default React.memo(Highchart, isEqual);
