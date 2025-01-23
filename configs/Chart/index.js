import React, { useLayoutEffect, useState, useCallback } from 'react';
import './styles.css';
import pt from 'prop-types';
import isEqual from 'deep-equal';

/**
 * Компонент контейнер графика <Chart />
 * @param {Object} props props компонента
 * @param {Object} props.container GoldenLayout container
 * @param {string|number} props.id идентификатор графика
 * @param {Component} props.SelectedChart react компонент графика
 * @returns {JSX.Element}
 */
const Chart = ({ container, id, SelectedChart }) => {
  const [width, setWidth] = useState(container.width);
  const [height, setHeight] = useState(container.height);

  /**
   * Обработчик измениет размеры графика при изменении размеров окна контейнера
   */
  const openResizeHandler = useCallback(() => {
    setWidth(container.width);
    setHeight(container.height);
  }, [container, setHeight, setWidth]);

  useLayoutEffect(() => {
    container.on('resize', openResizeHandler);

    return () => {
      container.off('resize');
    };
  }, [container, setWidth, setHeight, openResizeHandler]);

  return (
    <div className="chart-wrapper" id={id}>
      <SelectedChart height={height} width={width} id={id} />
    </div>
  );
};

Chart.propTypes = {
  container: pt.object,
  id: pt.string,
  SelectedChart: pt.elementType,
};

export default React.memo(Chart, isEqual);
