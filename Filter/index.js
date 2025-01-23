import React, { useState, memo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import pt from 'prop-types';
import isEqual from 'deep-equal';
import { InputPicker, Button, Grid, Row, Col } from 'rsuite';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Endpoints } from 'constants/endpoints';

import {
  fetchDisturbancesSettingInterval,
  clearGTMDisturbancesDisplacementParams,
  clearGTMDisturbancesSettingInterval,
  clearGtmDisturbancesEstimationDurationRequest,
} from 'store/actions';

import {
  getDisplacementParams,
  getSettingInterval,
  getSave,
} from 'store/selectors/proxyModel/GTMDisturbances';

import { INIT_DATA_PICKER, VALUE_ALL, getFilterDataWithReset, getFormatedData } from './constants';

import { renderMenuCustom } from 'components/proxyModel/utils/constants';

/**
 * Компонент фильтра Оценка продолжительности возмущений от ГТМ <FilterUI />
 * @param {Object} props props компонента
 * @param {{id:string?}} props.contextVenture контекстное значение НГДО
 * @param {{id:string?}} props.contextWorkshop контекстное значение ЦДНГ
 * @param {{id:string?}} props.contextFields контекстное значение месторождения
 * @param {{id:string?}} props.contextGroup контекстное значение участка
 * @returns {JSX.Element}
 */
const FilterUI = ({ contextVenture, contextWorkshop, contextFields, contextGroup }) => {
  const dispatch = useDispatch();

  const [dataVenturesPicker, setDataVenturesPicker] = useState(INIT_DATA_PICKER);
  const [dataWorkshopsPicker, setDataWorkshopsPicker] = useState(INIT_DATA_PICKER);
  const [dataFieldsPicker, setDataFieldsPicker] = useState(INIT_DATA_PICKER);
  const [dataGroupsPicker, setDataGroupsPicker] = useState(INIT_DATA_PICKER);

  const [formValue, setFormValue] = useState({
    venture: contextVenture?.id || null,
    workshop: contextWorkshop?.id || null,
    field: contextFields?.[0]?.id || null,
    group: contextGroup?.id || null,
  });

  const oldFormValue = useRef({ ...formValue });
  const isActualPickerDataDependingOn = useRef({
    venture: false,
    workshop: false,
    field: false,
    group: false,
    isActual: false,
  });
  const { isLoading } = useSelector(getSettingInterval);
  const { isLoading: recalculateIsLoading } = useSelector(getDisplacementParams);
  const { isLoading: saveIsLoading } = useSelector(getSave);

  /** Функция загружает список НГДО */
  const loadVenturesData = () =>
    axios
      .get(Endpoints.all_child_ventures)
      .then(({ data }) => setDataVenturesPicker(getFormatedData(data)))
      .catch(() => {
        setDataVenturesPicker(INIT_DATA_PICKER);
      });

  /** Функция загружает список ЦДНГ */
  const loadWorkshopsData = ventureId =>
    axios
      .get(
        ventureId === VALUE_ALL
          ? Endpoints.all_workshops
          : Endpoints.workshops_by_ventures(ventureId),
      )
      .then(({ data }) => setDataWorkshopsPicker(getFormatedData(data)))
      .catch(() => {
        setDataWorkshopsPicker(INIT_DATA_PICKER);
      });

  /** Функция загружает список Месторождений */
  const loadFieldsData = workshopId =>
    axios
      .get(
        workshopId === VALUE_ALL
          ? Endpoints.root_fields()
          : Endpoints.fields_by_workshops(workshopId),
      )
      .then(({ data }) => setDataFieldsPicker(getFormatedData(data)))
      .catch(() => {
        setDataFieldsPicker(INIT_DATA_PICKER);
      });

  /**
   * Функция загружает список Групп
   *
   */

  const loadGroupsData = (workshopId, fieldId) =>
    axios
      .get(Endpoints.getGroupsComboBox(fieldId, workshopId))
      .then(({ data }) => setDataGroupsPicker(getFormatedData(data)))
      .catch(() => {
        setDataGroupsPicker(INIT_DATA_PICKER);
      });

  /**
   * Функция возвращает обработчик смены значения поля фильтра fieldName
   * @param {string} fieldName имя поля
   * @param {boolean} reset флаг сброса
   * @returns {(value: string)=>void} функция обработчик
   */
  const changeFilterValue = (fieldName, reset) => value => {
    setFormValue({ ...formValue, ...getFilterDataWithReset(fieldName, reset ? null : value) });
  };

  const changeValueHandlerCustom = (fieldName, reset, value) => {
    setFormValue({ ...formValue, ...getFilterDataWithReset(fieldName, reset ? null : value) });
  };

  /** Обработчик открытия выпадающего списка НГДО */
  const handleVentureOpen = () => {
    if (!dataVenturesPicker.isLoaded) {
      loadVenturesData();

      setDataWorkshopsPicker(INIT_DATA_PICKER);
      setDataFieldsPicker(INIT_DATA_PICKER);
      setDataGroupsPicker(INIT_DATA_PICKER);
    }
  };

  /** Обработчик открытия выпадающего списка ЦДНГ */
  const handleWorkshopOpen = () => {
    if (!isActualPickerDataDependingOn.current.venture) {
      isActualPickerDataDependingOn.current.venture = true;
      loadWorkshopsData(formValue.venture);
      setDataGroupsPicker(INIT_DATA_PICKER);
    }
  };

  /** Обработчик открытия выпадающего списка Месторождений */
  const handleFieldsOpen = () => {
    if (!isActualPickerDataDependingOn.current.workshop) {
      isActualPickerDataDependingOn.current.workshop = true;
      loadFieldsData(formValue.workshop);
      setDataGroupsPicker(INIT_DATA_PICKER);
    }
  };

  /**
   * Обработчик раскрытия выпадающего списка Группы
   */

  const handleGroupsOpen = () => {
    if (!isActualPickerDataDependingOn.current.field) {
      isActualPickerDataDependingOn.current.field = true;
      loadGroupsData(formValue.workshop, formValue.field);
    }
  };

  /** Обработчик клика по кнопке Применить выбранные настройки фильтра */
  const handleFilterApply = () => {
    const settingsIntervalParams = {
      ventures: formValue.venture,
      workshop: formValue.workshop,
      field: formValue.field,
      group_well: formValue.group,
    };

    dispatch(clearGTMDisturbancesSettingInterval());
    dispatch(clearGTMDisturbancesDisplacementParams());
    dispatch(clearGtmDisturbancesEstimationDurationRequest());

    dispatch(fetchDisturbancesSettingInterval(settingsIntervalParams));
  };

  /**
   * Функция обработки рендера выпадающего списка
   * @param {*} isLoaded флаг загрузки данных
   * @returns {(menu: Object.<string, any>)=>JSX.Element}
   */
  const renderMenu = isLoaded => menu => isLoaded ? menu : <S.Loading>Загрузка...</S.Loading>;

  useEffect(() => {
    if (!isActualPickerDataDependingOn.current.isActual) {
      Object.entries(formValue).forEach(([field, val]) => {
        if (oldFormValue.current[field] !== val)
          isActualPickerDataDependingOn.current[field] = false;
      });
    }
    isActualPickerDataDependingOn.current.isActual = false;

    return () => {
      oldFormValue.current = { ...formValue };
    };
  }, [formValue]);

  useEffect(() => {
    loadVenturesData();
    isActualPickerDataDependingOn.current.venture = true;

    if (formValue.venture) {
      loadWorkshopsData(formValue.venture);
      isActualPickerDataDependingOn.current.workshop = true;
    }
    if (formValue.workshop) {
      loadFieldsData(formValue.workshop);
      isActualPickerDataDependingOn.current.field = true;
    }
    if (formValue.field) {
      loadGroupsData(formValue.workshop, formValue.field);
      isActualPickerDataDependingOn.current.group = true;
    }
  }, []);

  const paramsDisabled = {
    formValueParams:
      formValue.venture == null ||
      formValue.workshop == null ||
      formValue.field == null ||
      formValue.group == null,
    loadingBtn: isLoading || recalculateIsLoading || saveIsLoading,
  };

  const disabledForm = paramsDisabled?.formValueParams || paramsDisabled?.loadingBtn;

  return (
    <S.Root>
      <S.Title>Фильтр</S.Title>
      <S.Grid fluid>
        <S.Row>
          <S.Col xs={4}>
            <S.Label>НГДО</S.Label>
            <InputPicker
              size="xs"
              valueKey="id"
              value={formValue.venture}
              placeholder="Выберите НГДО"
              data={dataVenturesPicker.data}
              onOpen={handleVentureOpen}
              onClean={changeFilterValue('venture', true)}
              renderMenu={renderMenuCustom(
                dataVenturesPicker.isLoaded,
                changeValueHandlerCustom,
                'venture',
                '420px',
              )}
            />
          </S.Col>
          <S.Col xs={4}>
            <S.Label>ЦДНГ</S.Label>
            <InputPicker
              size="xs"
              valueKey="id"
              value={formValue.workshop}
              placeholder="Выберите ЦДНГ"
              disabled={formValue.venture == null}
              data={dataWorkshopsPicker.data}
              onOpen={handleWorkshopOpen}
              onClean={changeFilterValue('workshop', true)}
              renderMenu={renderMenuCustom(
                dataWorkshopsPicker.isLoaded,
                changeValueHandlerCustom,
                'workshop',
              )}
            />
          </S.Col>
          <S.Col xs={4}>
            <S.Label>Месторождение</S.Label>
            <InputPicker
              size="xs"
              valueKey="id"
              value={formValue.field}
              placeholder="Выберите месторождение"
              disabled={formValue.venture == null || formValue.workshop == null}
              data={dataFieldsPicker.data}
              onOpen={handleFieldsOpen}
              onSelect={changeFilterValue('field')}
              onClean={changeFilterValue('field', true)}
              renderMenu={renderMenu(dataFieldsPicker.isLoaded)}
            />
          </S.Col>
          <S.Col xs={4}>
            <S.Label>Группа скважин</S.Label>
            <InputPicker
              size="xs"
              valueKey="id"
              value={formValue.group}
              placeholder="Выберите группу"
              disabled={
                formValue.venture == null || formValue.workshop == null || formValue.field == null
              }
              data={dataGroupsPicker.data}
              onOpen={handleGroupsOpen}
              onClean={changeFilterValue('group', true)}
              renderMenu={renderMenuCustom(
                dataGroupsPicker.isLoaded,
                changeValueHandlerCustom,
                'group',
              )}
            />
          </S.Col>

          <S.Col xs={2}>
            <S.Submit>
              <Button appearance="primary" onClick={handleFilterApply} disabled={disabledForm}>
                Сформировать
              </Button>
            </S.Submit>
          </S.Col>
        </S.Row>
      </S.Grid>
    </S.Root>
  );
};

const S = {
  Grid: styled(Grid)`
    width: 100%;
  `,
  Row: styled(Row)`
    padding: 4px;
  `,
  Col: styled(Col)`
    margin-right: 10px;
    .rs-picker-toggle-wrapper {
      display: flex;
      flex: 1 1;
      .rs-picker-tag-wrapper {
        padding-right: 0;
      }
    }
  `,
  Root: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-self: center;
    margin: 8px;
    min-width: 200px;
    border: solid 2px dimgray;
    border-radius: 4px;
    padding: 4px;
  `,
  Submit: styled.div`
    display: flex;
    justify-content: flex-end;
    padding-top: 18px;
    min-width: 120px;
    button {
      width: 100%;
    }
  `,
  Label: styled.div`
    flex: 1 0 40%;
    margin-right: 10px;
    white-space: nowrap;
    display: inline;
    vertical-align: middle;
    line-height: 24px;
  `,
  Title: styled.p`
    position: absolute;
    top: 0px;
    left: 30px;
    background: #fff;
    padding: 0px 4px;
  `,
  Loading: styled.p`
    padding: 4px;
    color: #999;
    text-align: 'center';
  `,
};

FilterUI.propTypes = {
  contextVenture: pt.object,
  contextWorkshop: pt.object,
  contextFields: pt.array,
  contextGroup: pt.object,
};

export const Filter = memo(FilterUI, isEqual);
