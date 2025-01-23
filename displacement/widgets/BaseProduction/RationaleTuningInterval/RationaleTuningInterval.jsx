import React, { useCallback, useEffect, useMemo, useState } from 'react';
import pt from 'prop-types';
import highchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { isEmpty } from 'ramda';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import CustomLoader from 'shared/CustomLoader';
import { getSettingInterval } from 'store/selectors/proxyModel/GTMDisturbances';
import DatePickerWrapper from 'shared/DatePickerWrapper';
import { useHighcharts } from 'utils/hooks/useHighcharts';
import { formValueDefault } from '../DisplacementCharacteristics/constants';

import useRationaleTuningIntervalConfig from '../hooks/useRationaleTuningIntervalConfig';

/**
 * Компонент Обоснование интервала настройки <RationaleTuningInterval />
 * @param {Object} props props компонента
 * @param {Object} props.container GoldenLayout container
 * @returns {JSX.Element}
 */
export const RationaleTuningInterval = ({ container }) => {
  const { Highcharts } = useHighcharts();
  const { data, isLoading, isLoaded } = useSelector(getSettingInterval);

  const [width, setWidth] = useState(container.width);
  const [height, setHeight] = useState(container.height);
  const isNoData = (!isLoading && isLoaded && isEmpty(data)) || data?.error?.code !== 0;

  const [formValue, setFormValue] = useState(formValueDefault);

  const openResizeHandler = useCallback(
    (widthSetter, heightSetter) => {
      widthSetter(container.width);
      heightSetter(container.height);
    },
    [container],
  );

  useEffect(() => {
    if (data) {
      setFormValue({
        ...formValue,
        startDate: data?.settings_interval?.period_start
          ? data?.settings_interval.period_start
          : formValueDefault?.startDate,

        endDate: data?.settings_interval?.period_end
          ? data.settings_interval.period_end
          : formValueDefault?.endDate,
        trendStartDate: data?.trend?.period_start
          ? data.trend.period_start
          : formValueDefault?.trendStartDate,
        trendEndDate: data?.trend?.period_end
          ? data.trend.period_end
          : formValueDefault?.trendEndDate,
        determinationFactor: data?.determination_factor
          ? data.determination_factor
          : formValueDefault?.determinationFactor,
        trendMonths: data?.trend_months ? data.trend_months : formValueDefault?.trendMonths,
      });
    }
  }, [data]);

  /**
   * Функция возвращает обработчик смены значения поля фильтра fieldName
   * @param {string} fieldName имя поля
   * @param {boolean} reset флаг сброса
   * @returns {(value: string)=>void} функция обработчик
   */

  useEffect(() => {
    container.on('resize', () => openResizeHandler(setWidth, setHeight));
    return () => {
      container.off('resize');
    };
  }, [container, openResizeHandler]);

  const chartsConfig = useRationaleTuningIntervalConfig(data, height);
  const options = useMemo(() => chartsConfig, [chartsConfig]);

  return (
    <S.Root>
      {!isLoaded && <S.Empty>Выберите параметры</S.Empty>}
      {isNoData && isLoaded && (
        <S.Empty>{data?.error?.description && data.error.description}</S.Empty>
      )}

      {isLoading ? (
        <CustomLoader />
      ) : (
        isLoaded &&
        !isNoData && (
          <>
            <S.InfoData>
              <S.ItemUl>
                <li>Период</li>
                <li>c</li>

                <li>
                  <DatePickerWrapper
                    value={formValue?.startDate}
                    format="MM-YYYY"
                    placeholder="ММ-ГГГГ"
                    ranges={[]}
                    defaultValue={new Date(formValueDefault?.startDate)}
                    disabled
                    readOnly
                  />
                </li>

                <li>по</li>

                <li>
                  <DatePickerWrapper
                    value={formValue?.endDate}
                    format="MM-YYYY"
                    placeholder="ММ-ГГГГ"
                    ranges={[]}
                    defaultValue={new Date(formValueDefault?.endDate)}
                    disabled
                    readOnly
                  />
                </li>

                <li>
                  <span>Количество месяцев тренда: </span>
                  <span>{formValue?.trendMonths}</span>
                </li>
              </S.ItemUl>

              <S.ItemUl>
                <li>Тренд</li>

                <li>c</li>

                <li>
                  <DatePickerWrapper
                    value={formValue?.trendStartDate}
                    format="MM-YYYY"
                    placeholder="ММ-ГГГГ"
                    ranges={[]}
                    defaultValue={new Date(formValueDefault?.trendStartDate)}
                    disabled
                    readOnly
                  />
                </li>

                <li>по</li>

                <li>
                  <DatePickerWrapper
                    value={formValue?.trendEndDate}
                    format="MM-YYYY"
                    placeholder="ММ-ГГГГ"
                    ranges={[]}
                    defaultValue={new Date(formValueDefault?.trendEndDate)}
                    disabled
                    readOnly
                  />
                </li>

                <li>
                  <span> Коэффициент детерминации: </span>
                  <span>{formValue?.determinationFactor}</span>
                </li>
              </S.ItemUl>
            </S.InfoData>

            <HighchartsReact
              highcharts={highchartsMore(Highcharts)}
              options={options}
              constructorType="chart"
            />
          </>
        )
      )}
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

RationaleTuningInterval.propTypes = {
  container: pt.object,
};
