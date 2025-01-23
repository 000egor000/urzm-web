import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import '@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css';
import '@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { pagesConfigs } from 'constants/pagesConfigs';
import GoldenLayoutForm from 'configs/GoldenLayoutForm';
import { ErrorBoundary } from 'shared/ErrorBoundary';
import { getAppContext } from 'store/selectors/shared/appContext';
import { Filter } from 'components/displacement/widgets/BaseProduction/Filter';
import {
  clearGTMDisturbancesSettingInterval,
  clearGTMDisturbancesDisplacementParams,
  clearGtmDisturbancesEstimationDurationRequest,
} from 'store/actions';
/**
 * Компонент страницы "Базовая добыча и характеристики вытеснения" <BaseProduction />
 * @returns {JSX.Element}
 */
export const BaseProduction = () => {
  const dispatch = useDispatch();
  const { contextVenture, contextWorkshop, contextFields } = useSelector(getAppContext);

  useEffect(() => {
    return () => {
      dispatch(clearGTMDisturbancesSettingInterval());
      dispatch(clearGTMDisturbancesDisplacementParams());
      dispatch(clearGtmDisturbancesEstimationDurationRequest());
    };
  }, []);

  return (
    <ErrorBoundary>
      <S.Root>
        <Filter
          contextVenture={contextVenture}
          contextWorkshop={contextWorkshop}
          contextFields={contextFields}
        />
        <GoldenLayoutForm initConfig={pagesConfigs.baseProduction} />
      </S.Root>
    </ErrorBoundary>
  );
};

const S = {
  Root: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  `,
};

export default BaseProduction;
