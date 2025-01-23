import React, { useCallback, useEffect, useMemo, useState } from 'react';
import pt from 'prop-types';
import highchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { isEmpty } from 'ramda';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CustomLoader from 'shared/CustomLoader';
import {
  getDisplacementParams,
  getSettingInterval,
} from 'store/selectors/proxyModel/GTMDisturbances';

import { useHighcharts } from 'utils/hooks/useHighcharts';
import useDailyDownloadConfig from '../hooks/useDailyDownloadConfig';
import { errorBlock } from '../DisplacementCharacteristics/constants';

/**
 * Компонент Обоснование интервала настройки <DailyDownload />
 * @param {Object} props props компонента
 * @param {Object} props.container GoldenLayout container
 * @returns {JSX.Element}
 */

export const DailyDownload = ({ container }) => {
  const { Highcharts } = useHighcharts();
  const { data, isLoading, isLoaded } = useSelector(getDisplacementParams);
  const {
    data: dataSetting,
    isLoading: isLoadingSetting,
    isLoaded: isLoadedSetting,
  } = useSelector(getSettingInterval);

  const [width, setWidth] = useState(container.width);
  const [height, setHeight] = useState(container.height);
  const isNoData =
    (!isLoading && isLoaded && isEmpty(data?.coordinates_daily_displacement_characteristic)) ||
    data?.error?.code !== 0;

  const isNoDataSetting =
    (!isLoadingSetting &&
      isLoadedSetting &&
      isEmpty(dataSetting?.coordinates_daily_displacement_characteristic)) ||
    dataSetting?.error?.code !== 0;

  const openResizeHandler = useCallback(
    (widthSetter, heightSetter) => {
      widthSetter(container.width);
      heightSetter(container.height);
    },
    [container],
  );

  useEffect(() => {
    container.on('resize', () => openResizeHandler(setWidth, setHeight));
    return () => {
      container.off('resize');
    };
  }, [container, openResizeHandler]);

  const chartsConfig = useDailyDownloadConfig(data, dataSetting, height);

  const options = useMemo(() => chartsConfig, [chartsConfig]);

  const controlView = () => {
    if (isLoading || isLoadingSetting) return <CustomLoader />;

    if ((isNoData && isLoaded) || (isNoDataSetting && isLoadedSetting))
      return <S.Empty>{errorBlock(data, dataSetting)}</S.Empty>;

    return (
      <HighchartsReact
        highcharts={highchartsMore(Highcharts)}
        options={options}
        constructorType="chart"
      />
    );
  };

  return (
    <S.Root>
      {!isLoaded && !isLoadedSetting && <S.Empty>Выберите параметры</S.Empty>}
      {controlView()}
    </S.Root>
  );
};

const S = {
  Root: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-self: center;
    padding: 8px;
  `,
  InfoData: styled.div`
    width: 100%;
  `,
  ItemUl: styled.ul`
    display: flex;
    width: 100%;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    list-style: none;
    margin: 5px 0;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 0 5px;

      &:first-child {
        width: 80px;
      }
      &:last-child {
        width: 250px;
      }
      span {
        &:last-child {
          margin-left: 5px;
          font-weight: 600;
        }
      }
    }
  `,

  Empty: styled.div`
    display: block;
    text-align: center;
    width: 100%;
    color: #8e8e93;
    padding: 8px;
  `,
};

DailyDownload.propTypes = {
  container: pt.object,
};
