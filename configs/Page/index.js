import React, { useCallback, useEffect } from 'react';
import pt from 'prop-types';
import isEqual from 'deep-equal';
import { useDispatch } from 'react-redux';
import '@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css';
import '@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-dark-theme.css';

import { setControl, setShift } from 'store/actions';

import './styles.css';
import styled from 'styled-components';
import GoldenLayoutForm from 'configs/GoldenLayoutForm';
import { ModalContainer } from 'configs/ModalContainer';

export const CENTER_UPDATE_EVENT = 'update-center';

/**
 * Компонент <Page />
 * @param {Object} props props компонента
 * @param {Object} props.config конфигурация GoldenLayout
 * @param {string} props.componentClass css класс компонента
 * @returns {JSX.Element}
 */
const Page = ({ config, componentClass }) => {
  const dispatch = useDispatch();

  /**
   * Обработчик события keyup
   * @param {Object} key идентификатор кнопки
   * @param {Object} value значение
   */
  const keyHandler = useCallback(
    (key, value) => {
      switch (key) {
        case 'Control':
          dispatch(setControl(value));
          break;

        case 'Shift':
          dispatch(setShift(value));
          break;

        default:
          break;
      }
    },
    [dispatch],
  );

  /**
   * Обработчик события keydown
   */
  const keydownHandler = useCallback(
    event => {
      keyHandler(event.key, true);
    },
    [keyHandler],
  );

  /**
   * Обработчик события keyup
   */
  const keyupHandler = useCallback(
    event => {
      keyHandler(event.key, false);
    },
    [keyHandler],
  );

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    };
  }, [keydownHandler, keyupHandler]);

  return (
    <div className={componentClass}>
      <GoldenLayoutForm initConfig={config} level="root" />
      <S.ModalContainer />
    </div>
  );
};

Page.propTypes = {
  config: pt.object.isRequired,
  componentClass: pt.string,
};

const S = {
  ModalContainer: styled(ModalContainer)`
    &.rs-modal {
      margin: 0;
      width: 100%;
      height: calc(100% - 5px);

      .rs-modal-dialog {
        height: calc(100% - 10px);
        margin: 5px;
        .rs-modal-content {
          height: inherit;
          padding: 10px;
        }
      }
    }
  `,
  PortalContainer: styled.div`
    padding: 10px;
  `,
};
export default React.memo(Page, isEqual);
