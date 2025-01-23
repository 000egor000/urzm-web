import React, { useState, useCallback, useEffect, useMemo } from 'react';
import pt from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'ramda';
import CustomLoader from 'shared/CustomLoader';
import { InputPicker, InputNumber, Checkbox, Button } from 'rsuite';
import DatePickerWrapper from 'shared/DatePickerWrapper';
import FixHeightTable from 'shared/Table/FixHeightTable';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import toExcelIcon from 'icons/toExcel.png';
import {
  getSettingInterval,
  getDisplacementParams,
  getEstimationDuration,
  getSave,
} from 'store/selectors/proxyModel/GTMDisturbances';
import {
  forecastData,
  formatСasting,
  startDataForm,
  notNun,
  formatData,
  constantForecast,
} from './constants';

import { getColumns } from './columns';
import { colors } from '../../../../../constants/colors';
import useDocxExport from '../hooks/useDocxExport';

import {
  fetchDisturbancesSettingIntervalRecalculate,
  fetchDisturbancesSettingIntervalSave,
} from 'store/actions';

/**
 * Компонент Характеристики вытеснения <DisplacementCharacteristics />
 * @param {Object} props props компонента
 * @param {Object} props.container GoldenLayout container
 * @returns {JSX.Element}
 */

export const DisplacementCharacteristics = ({ container }) => {
  const { data, isLoading, isLoaded } = useSelector(getSettingInterval);
  const { data: recalculateData, isLoading: recalculateIsLoading } =
    useSelector(getDisplacementParams);
  const { data: currentRadio } = useSelector(getEstimationDuration);
  const { isLoading: saveIsLoading } = useSelector(getSave);

  const [width, setWidth] = useState(container.width);
  const [height, setHeight] = useState(container.height);
  const isNoData = (!isLoading && isLoaded && isEmpty(data)) || data?.error?.code !== 0;
  const columns = getColumns();
  const [dataTable, setDataTable] = useState([]);

  const { exportChart } = useDocxExport({
    chart: {
      recalculateData,
      data,
      height,
    },
    dataInit: formatСasting(data, dataTable, currentRadio),
  });

  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState(startDataForm);

  const openResizeHandler = useCallback(
    (widthSetter, heightSetter) => {
      widthSetter(container.width);
      heightSetter(container.height);
    },
    [container],
  );

  const titleByExcel = `Характеристики вытеснения ${moment(formValue?.startDate).format(
    'MM-YYYY',
  )}-${moment(formValue?.endDate).format('MM-YYYY')}`;

  useEffect(() => {
    if (data) {
      const calculation = data?.displacement_characteristic_calculation;

      setFormValue({
        ...formValue,

        liquidProduction: calculation?.daily_liquid_production_id
          ? String(calculation.daily_liquid_production_id)
          : startDataForm.liquidProduction,
        liquidProductionValue: calculation?.daily_liquid_production_value
          ? calculation?.daily_liquid_production_value
          : startDataForm.liquidProductionValue,
        maximumTesting: calculation?.max_count_month
          ? calculation?.max_count_month
          : startDataForm.maximumTesting,
        minimumTesting: calculation?.min_count_month
          ? calculation?.min_count_month
          : startDataForm.minimumTesting,
        pumpingDaily: calculation?.daily_water_pumping_production_id
          ? String(calculation?.daily_water_pumping_production_id)
          : startDataForm.pumpingDaily,
        pumpingDailyValue: calculation?.daily_water_pumping_production_value
          ? calculation.daily_water_pumping_production_value
          : startDataForm.pumpingDailyValue,
        startDate: moment(
          calculation?.start_date
            ? calculation?.start_date
            : moment(data?.trend?.period_start ? data.trend.period_start : ''),
        ),
        endDate: moment(
          calculation?.end_date
            ? calculation?.end_date
            : moment(data?.trend?.period_end ? data.trend.period_end : ''),
        ),
        approximation: calculation?.approximation
          ? calculation.approximation
          : startDataForm.approximation,
        determination: calculation?.determination
          ? calculation?.determination
          : startDataForm.determination,
        deviation: calculation?.use_mobile_reserves_value
          ? calculation?.use_mobile_reserves_value
          : startDataForm.deviation,
        moving: calculation?.use_mobile_reserves_value
          ? calculation.use_mobile_reserves_value
          : startDataForm.moving,
        useMoving: calculation?.use_mobile_reserves
          ? calculation.use_mobile_reserves
          : startDataForm.useMoving,
        useDeviation: calculation?.use_deviation_calculated
          ? calculation?.use_deviation_calculated
          : startDataForm.useDeviation,
      });
    }
    return () => setFormValue(startDataForm);
  }, [data]);

  useEffect(() => {
    if (currentRadio) transferValue();
  }, [currentRadio]);

  // Перенос выбранного радио из 3 вкладки в таблицу
  const transferValue = () => {
    const changedData = dataTable?.map((item, i) => {
      if (item?.algorithm === currentRadio?.useIput?.characteristic) {
        item.setting_interval_start = moment(item?.setting_interval_end)
          .subtract(currentRadio?.useIput?.setting_period_count - 1, 'month')
          .format(formatData);

        item.number_months_setting = currentRadio?.useIput?.setting_period_count;

        return item;
      }
      item.number_months_setting = data?.trend_months;
      return item;
    });

    setDataTable(changedData);
  };

  /**
   * Функция срабатывает при обновлении значения ячейки таблицы
   * @param {string} columnId идентификатор колонки
   * @param {string} rowId идентификатор строки
   * @param {any} value значение
   */
  const updateItemValue = (columnId, rowId, value) => {
    const changedData = dataTable.map((item, i) => {
      if (i === +rowId) {
        item[columnId] = value;
        return item;
      }
      return item;
    });

    setDataTable(changedData);
  };

  /**
   * Функция срабатывает при обновлении значения ячейки таблицы
   * @param {string} id идентификатор колонки
   * @param {string} row идентификатор строки
   * @param {any} value значение

   */

  const handleUpdateTable = (row, id, value) => {
    const changedData = dataTable.map((item, i) => {
      if (i === +row) {
        if (id === 'setting_interval_end') {
          item.forecast_interval_start = moment(value).add(1, 'months').format(formatData);

          item.setting_interval_start = moment(value)
            .subtract(item.number_months_setting - 1, 'months')
            .format(formatData);
        }

        item[id] = value;
        return item;
      }
      return item;
    });

    setDataTable(changedData);
  };

  /**
   * Функция срабатывает при обновлении значения ячейки таблицы
   * @param {string} id идентификатор колонки
   * @param {string} row идентификатор строки
   * @param {any} value значение

   */
  const handleUpdateMonths = (row, id, value) => {
    const changedData = dataTable.map((item, i) => {
      if (i === +row) {
        item.setting_interval_start = moment(item.setting_interval_end)
          .subtract(+value - 1, 'month')
          .format(formatData);

        item[id] = value;
        return item;
      }
      return item;
    });
    setDataTable(changedData);
  };

  const controlInput = (oldValue, newValue) => +newValue >= 4 && +newValue <= 36;

  /**
   * Функция возвращает обработчик смены значения поля фильтра fieldName
   * @param {string} fieldName имя поля
   * @param {boolean} reset флаг сброса
   * @returns {(value: string)=>void} функция обработчик
   */
  const changeDateValue = (fieldName, reset) => value => {
    setFormValue({
      ...formValue,
      [fieldName]: fieldName === 'useDeviation' || fieldName === 'useMoving' ? !value : value,
    });

    if (fieldName === 'maximumTesting') {
      setDataTable(changeDateLimit(value));
    }
  };

  const changeDateLimit = value =>
    dataTable?.map(el => {
      return {
        ...el,
        forecast_interval_end: moment(el?.forecast_interval_start)
          .add(+value - 1, 'months')
          .format(formatData),
        max_test: value,
      };
    });

  const changeAllDates = (fieldName, value) =>
    dataTable?.map(el => {
      return {
        ...el,
        setting_interval_start:
          fieldName === 'startDate' ? moment(value).format(formatData) : el?.setting_interval_start,
        setting_interval_end:
          fieldName === 'endDate' ? moment(value).format(formatData) : el?.setting_interval_end,
        number_months_setting:
          (fieldName === 'endDate' ? moment(value) : moment(el?.setting_interval_end)).diff(
            fieldName === 'startDate' ? moment(value) : moment(el?.setting_interval_start),
            'months',
          ) + 1,
      };
    });

  const changeDate = (fieldName, reset) => value => {
    setFormValue({
      ...formValue,
      [fieldName]: value,
    });

    setDataTable(changeAllDates(fieldName, value));
  };

  useEffect(() => {
    container.on('resize', () => openResizeHandler(setWidth, setHeight));
    return () => {
      container.off('resize');
    };
  }, [container, openResizeHandler]);

  /**
   * Функция обработчик подкрашивания поля таблицы
   * @param {string} cell данные по полю строки
   * @param {any} value значение
   */
  const getCellProps = useMemo(
    () =>
      ({ cell }) => {
        return {
          style: {
            backgroundColor: !cell?.row?.original?.compliance_criteria
              ? colors?.red
              : 'transparent',
            color: !cell?.row?.original?.compliance_criteria ? colors?.white : 'inherit',
          },
        };
      },
    [dataTable],
  );

  useEffect(() => {
    (data || recalculateData) && setDataTable(formationOfStructure());
    return () => setDataTable([]);
  }, [data, recalculateData, formValue.minimumTesting]);

  // /** Формирование нужной структуры для таблицы */
  const formationOfStructure = () =>
    (recalculateData?.displacement_characteristic_criteria
      ? recalculateData?.displacement_characteristic_criteria
      : data?.displacement_characteristic_table
    )?.map(el => {
      for (const key in el) {
        if (el[key] === 'NaN') {
          el[key] = '-';
        }
      }
      return {
        ...el,
        forecast_interval_start: el?.forecast_interval?.period_start,
        forecast_interval_end: el?.forecast_interval?.period_end,
        setting_interval_start: el?.settings_interval?.period_start,
        setting_interval_end: el?.settings_interval?.period_end,
        min_test: formValue?.minimumTesting,
        max_test: formValue?.maximumTesting,
        limited_period_start: data?.settings_interval?.period_start,
      };
    });

  /** Обработчик клика по кнопке Пересчет ХВ по выбранным настройкам  */
  const handleFilterApply = () => {
    const params = {
      ventures: data?.ngdo,
      workshop: data?.workshop,
      field: data?.field,
      group_well: data?.group_well,

      liquid_production_daily_average: {
        id: formValue.liquidProduction,
        value:
          formValue.liquidProduction === constantForecast ? formValue.liquidProductionValue : null,
      },
      water_pumping_daily_average: {
        id: formValue.pumpingDaily,
        value: formValue.pumpingDaily === constantForecast ? formValue.pumpingDailyValue : null,
      },
      minimum_number_months_testing: formValue.minimumTesting,
      maximum_number_months_testing: formValue.maximumTesting,
      start_date: moment(formValue.startDate).format(formatData),
      end_date: moment(formValue.endDate).format(formatData),
      criteria: {
        determination: formValue.determination,
        approximation: formValue.approximation,
        deviation: formValue.deviation,
        moving: formValue.moving,
        use_deviation: formValue.useDeviation,
        use_moving: formValue.useMoving,
      },
      algorithm_date_list: notNun(dataTable),
    };

    dispatch(fetchDisturbancesSettingIntervalRecalculate(params));
  };
  /** Обработчик клика по кнопке Сохранить */
  const handleSave = () => {
    const params = {
      ventures: data?.ventures,
      workshop: data?.workshop,
      field: data?.field,
      group_well: data?.group_well,

      fluid_daily_curve:
        recalculateData?.coordinates_daily_displacement_characteristic?.liquid_forecast_list,
      oil_daily_curve:
        recalculateData?.coordinates_daily_displacement_characteristic?.oil_forecast_list,
      start_forecast_date: recalculateData?.start_forecast_date,
      start_setting_date: recalculateData?.start_setting_date,
      water_daily_curve:
        recalculateData?.coordinates_daily_displacement_characteristic?.water_forecast_list,
      water_pumping_daily_curve:
        recalculateData?.coordinates_daily_displacement_characteristic?.water_pumping_forecast_list,

      injection_fond: recalculateData?.injection_fond,
      production_fond: recalculateData?.production_fond,
      date: recalculateData?.date,

      well_fond_forecast_list: recalculateData?.well_fond_forecast_list,

      displacement_characteristic_calculation: {
        algorithm_date_list: notNun(dataTable),

        approximation: formValue.approximation,
        daily_liquid_production_id: formValue.liquidProduction,
        daily_liquid_production_value:
          formValue.liquidProduction === constantForecast ? formValue.liquidProductionValue : null,
        daily_water_pumping_production_id: formValue.pumpingDaily,
        daily_water_pumping_production_value:
          formValue.pumpingDaily === constantForecast ? formValue.pumpingDailyValue : null,
        determination: formValue.determination,
        end_date: moment(formValue.endDate).format(formatData),

        group_id: data?.group_well,
        id: null,
        max_count_month: formValue.maximumTesting,
        min_count_month: formValue.minimumTesting,
        save_date: moment().format(formatData),
        start_date: moment(formValue.startDate).format(formatData),
        use_deviation_calculated: formValue.useDeviation,
        use_deviation_calculated_value: formValue.deviation,
        use_mobile_reserves: formValue.useMoving,
        use_mobile_reserves_value: formValue.moving,
      },
    };

    dispatch(fetchDisturbancesSettingIntervalSave(params));
  };

  const TableBlock = useMemo(() => {
    return (
      !!dataTable?.length && (
        <FixHeightTable
          columns={columns}
          data={dataTable}
          titleByExcel={titleByExcel}
          typeByExcel="displacementParams"
          isLoading={isLoading}
          height={height}
          cellProps={{ updateItemValue }}
          updateTableDate={handleUpdateTable}
          updateData={handleUpdateMonths}
          getCellProps={getCellProps}
          controlInput={controlInput}
        />
      )
    );
  }, [dataTable, height]);

  const disabledPeriodStart = dateVal =>
    moment(dateVal) >= moment(formValue?.endDate).subtract(2, 'month') ||
    moment(dateVal) >= moment(data?.settings_interval?.period_end).subtract(2, 'month') ||
    moment(dateVal) <= moment(data?.settings_interval?.period_start);

  const disabledPeriodEnd = dateVal =>
    moment(dateVal) <= moment(formValue?.startDate).add(2, 'month') ||
    moment(dateVal) <= moment(data?.settings_interval?.period_start).add(3, 'month') ||
    moment(dateVal) >= moment(data?.settings_interval?.period_end).add(1, 'month');

  const paramsDisabled = {
    error: recalculateData && recalculateData?.error?.code === 0,
    valueLiquid:
      formValue.liquidProduction === constantForecast && !formValue.liquidProductionValue,
    valuePumping: formValue.pumpingDaily === constantForecast && !formValue.pumpingDailyValue,
    valueMoving: !formValue.moving && formValue.useMoving,
    valueDeviation: !formValue.deviation && formValue.useDeviation,

    loadingBtn: isLoading || recalculateIsLoading || saveIsLoading,
  };
  const valueAll =
    paramsDisabled?.valueMoving ||
    paramsDisabled?.valueDeviation ||
    paramsDisabled?.valueLiquid ||
    paramsDisabled?.valuePumping;

  const disabledSave = paramsDisabled?.loadingBtn || !paramsDisabled?.error || valueAll;
  const disabledRecalculation = paramsDisabled?.loadingBtn || valueAll;
  const disabledExcel =
    paramsDisabled?.loadingBtn ||
    (!paramsDisabled?.error && data?.coordinates_accumulated_displacement_characteristic === null);

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
        !isNoData &&
        dataTable && (
          <>
            <S.Title>Параметры расчета</S.Title>
            <S.GroupUl>
              <ul>
                <li>
                  <span>Прогнозная суточная добыча жидкости</span>
                  <InputPicker
                    defaultValue="1"
                    size="xs"
                    valueKey="id"
                    value={formValue.liquidProduction}
                    onChange={changeDateValue('liquidProduction')}
                    placeholder="Выберите значение"
                    data={forecastData}
                  />

                  {formValue.liquidProduction === constantForecast && (
                    <InputNumber
                      size="xs"
                      value={formValue.liquidProductionValue}
                      onChange={changeDateValue('liquidProductionValue')}
                    />
                  )}
                </li>

                <li>
                  <span>Прогнозная суточная закачка воды</span>
                  <InputPicker
                    defaultValue="1"
                    size="xs"
                    valueKey="id"
                    value={formValue.pumpingDaily}
                    onChange={changeDateValue('pumpingDaily')}
                    placeholder="Выберите значение"
                    data={forecastData}
                  />
                  {formValue.pumpingDaily === constantForecast && (
                    <InputNumber
                      size="xs"
                      value={formValue.pumpingDailyValue}
                      onChange={changeDateValue('pumpingDailyValue')}
                    />
                  )}
                </li>

                <li>
                  <span>Минимальное количество месяцев тестирования</span>
                  <InputNumber
                    size="xs"
                    defaultValue="4"
                    value={formValue.minimumTesting}
                    max={+formValue.maximumTesting}
                    onChange={changeDateValue('minimumTesting')}
                    disabled
                  />
                </li>
                <li>
                  <span>Максимальное количество месяцев тестирования</span>
                  <InputNumber
                    size="xs"
                    defaultValue="24"
                    value={formValue.maximumTesting}
                    min={+formValue.minimumTesting}
                    onChange={changeDateValue('maximumTesting')}
                  />
                </li>
              </ul>
              <ul>
                {formValue.startDate && (
                  <li>
                    <span>Дата начала периода настройки апроксимации</span>
                    <DatePickerWrapper
                      format="MM-YYYY"
                      placeholder="ММ-ГГГГ"
                      ranges={[]}
                      disabledDate={disabledPeriodStart}
                      onChange={changeDate('startDate')}
                      defaultValue={new Date(formValue.startDate)}
                    />
                  </li>
                )}

                {formValue.endDate && (
                  <li>
                    <span>Дата окончания периода настройки аппроксимации</span>
                    <DatePickerWrapper
                      format="MM-YYYY"
                      placeholder="ММ-ГГГГ"
                      ranges={[]}
                      onChange={changeDate('endDate')}
                      defaultValue={new Date(formValue.endDate)}
                      disabledDate={disabledPeriodEnd}
                    />
                  </li>
                )}

                <li>
                  <span>Коэффициент аппроксимации</span>
                  <InputNumber
                    size="xs"
                    value={formValue.approximation}
                    onChange={changeDateValue('approximation')}
                  />
                </li>

                <li>
                  <span>Коэффициент детерминации</span>
                  <InputNumber
                    size="xs"
                    value={formValue.determination}
                    onChange={changeDateValue('determination')}
                  />
                </li>
              </ul>
              <ul>
                <li>
                  <span> Отклонение расчетного значения от последней фактической добычи нефти</span>
                  <InputNumber
                    size="xs"
                    value={formValue.deviation}
                    onChange={changeDateValue('deviation')}
                  />
                </li>

                <li>
                  <span>Учитывать отклонение прогнозной добычи нефти</span>
                  <Checkbox
                    value={formValue.useDeviation}
                    checked={formValue.useDeviation}
                    onChange={changeDateValue('useDeviation')}
                    size="xs"
                  />
                </li>

                <li>
                  <span>Подвижные запасы</span>
                  <InputNumber
                    size="xs"
                    value={formValue.moving}
                    onChange={changeDateValue('moving')}
                  />
                </li>

                <li>
                  <span>Учитывать подвижные запасы нефти при определении нужных ХВ</span>
                  <Checkbox
                    value={formValue.useMoving}
                    checked={formValue.useMoving}
                    onChange={changeDateValue('useMoving')}
                    size="xs"
                  />
                </li>

                <li>
                  <div className="submitBtn">
                    <Button
                      appearance="primary"
                      onClick={handleSave}
                      disabled={disabledSave}
                      loading={saveIsLoading}
                    >
                      Сохранить
                    </Button>

                    <Button
                      appearance="primary"
                      onClick={handleFilterApply}
                      disabled={disabledRecalculation}
                      loading={recalculateIsLoading}
                    >
                      Пересчет ХВ
                    </Button>

                    <Button appearance="primary" onClick={exportChart} disabled={disabledExcel}>
                      <img src={toExcelIcon} alt="excel" />
                    </Button>
                  </div>
                </li>
              </ul>
            </S.GroupUl>
            {TableBlock}
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
    overflow-y: scroll;
    height: 100%;
  `,

  GroupUl: styled.div`
    display: flex;
    flex-wrap: wrap;

    ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      margin: 0;
      width: 33.33%;
      li {
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: baseline;
        margin: 3px 0;
        input,
        select,
        .rs-input,
        .rs-picker-toggle-wrapper,
        .rs-input-group,
        .rs-picker-date {
          width: 100%;
        }
        .rs-checkbox {
          .rs-checkbox-checker {
            left: -10px;
          }
        }
        .submitBtn {
          display: flex;
          justify-content: right;
          align-items: center;
          width: 100%;
          button {
            margin: 0 3px;

            &:last-child {
              padding: 0;
              background: transparent;
            }
          }
          img {
            cursor: pointer;
          }
        }
      }
    }
  `,

  Title: styled.p`
    padding: 5px 0;
    font-weight: bold;
    font-size: 14px;
    text-align: left;
    margin-bottom: 5px;
  `,

  Label: styled.div`
    flex: 1 0 40%;
    margin-right: 10px;
    display: inline;
    vertical-align: middle;
    line-height: 24px;
  `,
  Empty: styled.div`
    display: block;
    text-align: center;
    width: 100%;
    color: #8e8e93;
    padding: 8px;
  `,

  Button: styled.button`
    text-align: right;
  `,
};

DisplacementCharacteristics.propTypes = {
  container: pt.object,
};
