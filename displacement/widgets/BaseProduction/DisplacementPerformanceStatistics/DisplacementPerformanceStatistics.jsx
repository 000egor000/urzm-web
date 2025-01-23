import React, { useState, useEffect, useCallback } from 'react';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  getSettingInterval,
  getEstimationDuration,
} from 'store/selectors/proxyModel/GTMDisturbances';
import styled from 'styled-components';
import CustomLoader from 'shared/CustomLoader';
import pt from 'prop-types';
import { Row, Col, SelectPicker, Grid } from 'rsuite';
import { fetchDisturbancesEstimationDuration } from 'store/actions';
import { getColumns } from './columns';
import FixHeightTable from 'shared/Table/FixHeightTable';

/**
 * Компонент "Статистика характеристик вытеснения" <DisplacementPerformanceStatistics />
 * @param {Object} props props компонента
 * @param {Object} props.container GoldenLayout container
 * @returns {JSX.Element}
 */
export const DisplacementPerformanceStatistics = ({ container }) => {
  const [width, setWidth] = useState(container.width);
  const [height, setHeight] = useState(container.height);

  const dispatch = useDispatch();
  const columns = getColumns();
  const { data, isLoading, isLoaded } = useSelector(getSettingInterval);
  const { data: currentRadio } = useSelector(getEstimationDuration);

  const isNoData = (!isLoading && isLoaded && isEmpty(data)) || data?.error?.code !== 0;
  const [currentTableData, setCurrentTableData] = useState([]);
  const [characteristicArea, setCharacteristicArea] = useState('');

  const titleByExcel = `Статистика характеристик вытеснения
   ${data?.settings_interval?.period_start}-${data?.settings_interval?.period_end}`;

  const dataPicker =
    data?.displacement_characteristic_area_stat_map &&
    Object.entries(data?.displacement_characteristic_area_stat_map).map(item => ({
      label: item[0],
      value: item[1],
    }));

  const openResizeHandler = useCallback(
    (widthSetter, heightSetter) => {
      widthSetter(container.width);
      heightSetter(container.height);
    },
    [container],
  );

  // Сброс фильтра страницы
  useEffect(() => setCharacteristicArea(''), [data]);

  useEffect(() => {
    container.on('resize', () => openResizeHandler(setWidth, setHeight));
    return () => {
      container.off('resize');
    };
  }, [container, openResizeHandler]);

  const updateItemValue = (columnId, rowId, value, init) => {
    const updateData = currentTableData?.map((el, i) => {
      if (+i === +init?.id) {
        dispatch(
          fetchDisturbancesEstimationDuration({
            ...data,
            useIput: {
              ...el,
              [columnId]: true,
            },
          }),
        );
      }
      return {
        ...el,
        [columnId]: +i === +init?.id ? value : !value,
      };
    });

    setCurrentTableData(updateData);
  };

  useEffect(() => {
    if (data?.displacement_characteristic_area_stat_map && characteristicArea)
      setCurrentTableData(formationOfStructure());

    return () => setCurrentTableData([]);
  }, [data, characteristicArea]);

  // /** Формирование нужной структуры для таблицы */
  const formationOfStructure = () =>
    data?.displacement_characteristic_area_stat_map?.[characteristicArea]?.map(el => {
      for (const key in el) {
        if (el[key] === 'NaN') {
          el[key] = '-';
        }
      }

      if (
        el.characteristic === currentRadio?.useIput?.characteristic &&
        +el?.setting_period_count === +currentRadio?.useIput?.setting_period_count
      ) {
        return { ...el, accept: true };
      }
      el.accept = false;
      return el;
    });

  return (
    <S.Root>
      <S.Grid fluid>
        <>
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
                <S.Col xs={24}>
                  <S.CharacteristicGroup>
                    <S.Characteristic>
                      <p>Характеристика</p>
                      <SelectPicker
                        data={dataPicker}
                        value={characteristicArea}
                        valueKey="label"
                        onChange={setCharacteristicArea}
                        placeholder="Характеристика"
                        placement="bottomEnd"
                      />
                    </S.Characteristic>
                  </S.CharacteristicGroup>
                </S.Col>

                {characteristicArea && !!currentTableData?.length && (
                  <S.Col xs={24}>
                    <FixHeightTable
                      columns={columns}
                      data={currentTableData}
                      typeByExcel="DisplacementPerformanceStatistics"
                      titleByExcel={titleByExcel}
                      isLoading={isLoading}
                      height={height - 50}
                      cellProps={{ updateItemValue }}
                    />
                  </S.Col>
                )}
              </>
            )
          )}
        </>
      </S.Grid>
    </S.Root>
  );
};

const S = {
  Grid: styled(Grid)`
    width: 100%;
    margin-bottom: 20px;
  `,
  Root: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-self: center;
    padding: 8px;
  `,
  Characteristic: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    margin-right: 30px;
    & p {
      margin-right: 10px;
    }
  `,
  CharacteristicGroup: styled.div`
    display: flex;
    justify-content: right;
    margin: 10px 5px 10px 0px;
  `,
  Row: styled(Row)`
    padding: 4px;
  `,

  Col: styled(Col)``,
  Empty: styled.div`
    display: block;
    text-align: center;
    width: 100%;
    color: #8e8e93;
    padding: 8px;
  `,
};

DisplacementPerformanceStatistics.propTypes = {
  container: pt.object,
};
