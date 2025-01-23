import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getModalIsOpen, getModalType } from 'store/selectors/shared/modal';
import { hideModal } from 'store/actions';
import { MODAL_COMPONENTS } from 'constants/modalComponents';
import { AnalysisLossesAcqModal } from 'components/proxyModel/modals/AnalysisLossesAcqModal';
import { CompareProxyModelsModal } from 'components/proxyModel/modals/CompareProxyModelsModal';
import { DigitalTechModeModal } from 'components/proxyModel/modals/DigitalTechModeModal';
import { CreatingConstraintModelModal } from 'components/proxyModel/modals/CreatingConstraintModelModal';
import { ProxyModelCalculation } from 'components/proxyModel/modals/ProxyModelCalculation';
import { FillClustersInfoTable } from 'components/proxyModel/modals/FillClustersInfoTable';
import { GTMDisturbancesModal } from 'components/proxyModel/modals/GTMDisturbancesModal';

/**
 * Компонент контейнера модального окна <ModalContainer />
 * @param {Object} props props компонента
 * @returns {JSX.Element}
 */
export const ModalContainer = props => {
  const dispatch = useDispatch();
  const isOpen = useSelector(getModalIsOpen);
  const modalType = useSelector(getModalType);
  /**
   * Обработчик закрытия модального окна
   */
  const closeModal = useCallback(() => dispatch(hideModal()), [dispatch]);

  return (
    <>
      {
        {
          [MODAL_COMPONENTS.PROXY_MODEL_CALCULATION]: (
            <ProxyModelCalculation isOpen={isOpen} onClose={closeModal} {...props} />
          ),
          [MODAL_COMPONENTS.PROXY_MODEL_FILL_CLUSTERS_INFO_TABLE]: (
            <FillClustersInfoTable isOpen={isOpen} onClose={closeModal} {...props} />
          ),
          [MODAL_COMPONENTS.PROXY_MODEL_COMPARE_PROXY_MODELS]: (
            <CompareProxyModelsModal isOpen={isOpen} onClose={closeModal} {...props} />
          ),
          [MODAL_COMPONENTS.PROXY_MODEL_DIGITAL_TECH_MODE]: (
            <DigitalTechModeModal isOpen={isOpen} onClose={closeModal} {...props} />
          ),
          [MODAL_COMPONENTS.PROXY_MODEL_ANALYSIS_LOSSES_ACQ]: (
            <AnalysisLossesAcqModal isOpen={isOpen} onClose={closeModal} {...props} />
          ),
          [MODAL_COMPONENTS.PROXY_MODEL_CREATING_CONSTRAINT_MODEL]: (
            <CreatingConstraintModelModal isOpen={isOpen} onClose={closeModal} {...props} />
          ),
          [MODAL_COMPONENTS.PROXY_MODEL_GTM_DISTURBANCES]: (
            <GTMDisturbancesModal isOpen={isOpen} onClose={closeModal} {...props} />
          ),
        }[modalType]
      }
    </>
  );
};
