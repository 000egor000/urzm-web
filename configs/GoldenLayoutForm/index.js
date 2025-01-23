import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoldenLayoutComponent } from '@annotationhub/react-golden-layout';
import pt from 'prop-types';
import isEqual from 'deep-equal';
import styled from 'styled-components';
import ContextMenu from 'shared/ContextMenu';
import { getContextMenu } from 'store/selectors/home/map';
import { useDispatch, useSelector } from 'react-redux';
import { setContextMenu } from 'store/actions';
import { isDev } from 'utils/functions/envDetected';
import { useListOfWidgets } from 'utils/hooks';
import GoldenLayoutItemWrapper from './components/GoldenLayoutItemWrapper';
import { generateUniqueId } from 'utils/functions';
import '@annotationhub/react-golden-layout/dist/css/goldenlayout-base.css';
import '@annotationhub/react-golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import './styles.css';

/**
 * Компонент <GoldenLayoutForm />
 * @param {Object} props props компонента
 * @param {Object.<string, any>} props.initConfig конфигурация GoldenLayout
 * @param {boolean} props.modal если контейнер - модальное окно, то true, иначе false
 * @param {string} props.level уровень
 * @returns {JSX.Element}
 */
const GoldenLayoutForm = ({
  initConfig,
  modal,
  level,
  onLayoutManagerReady = layoutManager => {},
}) => {
  const dispatch = useDispatch();
  const contextMenu = useSelector(getContextMenu);
  // const widget = useSelector(getLayoutWidget);

  const [sizes, setSize] = useState({ height: window.innerHeight, width: window.innerWidth });
  const [layoutManager, setLayoutManager] = useState(null);
  const [triggerRerender, setTrigger] = useState({ [level]: 0 });
  const params = {
    height: sizes.height - 54,
    modal: modal,
  };

  const widgets = useListOfWidgets();

  useEffect(() => {
    const handleResize = () => {
      setSize({ height: window.innerHeight, width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (layoutManager && layoutManager.level === level) {
      layoutManager.on('stateChanged', () => {
        setTrigger({ [level]: (triggerRerender[level] += 1) });
      });
      return () => {
        layoutManager.off('stateChanged');
      };
    }
  }, [layoutManager, setTrigger]);

  useEffect(() => {
    if (layoutManager && layoutManager.level === level) {
      widgets.forEach(item => {
        if (!layoutManager._components[item.title]) {
          layoutManager.registerComponent(item.title, wrapComponent(item.component));
        }
      });
    }
  }, [layoutManager, widgets]);

  /**
   * Функция возвращает функцию, которая добавляет новый виджет в GoldenLayout
   * @param {Object} props props функции
   * @returns {()=>void}
   */
  const addWidget = useCallback(
    props => () => {
      // TODO: исправить
      // eslint-disable-next-line react/prop-types
      const { label, ...otherProps } = props;
      const id = generateUniqueId();
      layoutManager.root.contentItems[0].contentItems[0].addChild(
        {
          component: label,
          type: 'react-component',
          title: label,
          props: { id, config, ...otherProps },
        },
        0,
      );
    },
    [layoutManager],
  );

  /**
   * HOC оборачивает компонент в GoldenLayoutItemWrapper
   * @param {Component} component react компонент
   * @returns {JSX.Element}
   */
  const wrapComponent = component => {
    return goldenLayout => (
      <GoldenLayoutItemWrapper
        goldenLayout={goldenLayout}
        render={component}
        addWidget={addWidget}
      />
    );
  };

  /**
   * Конфигурация GoldenLayoutComponent
   */
  const config = useMemo(() => {
    /*
      Внимание: инициализация GL довольно сложна, причина заключается в том, как работает библиотека GL-React
      Основным побочным эффектом использования этой библиотеки является то, что инициализация макета происходит не так,
      как добавляются новые элементы.
      Более того, первоначальный макет создается еще до того, как компоненты react будут зарегистрированы в GL.

      Эти факторы в совокупности могут привести ко всевозможным ошибкам.
      Ниже приведены ошибки, которые я обнаружил до сих пор:
        - Элементы из начальной компоновки всегда демонтируются и монтируются обратно после закрытия одного из начальных элементов;
          Это привело к тому, что первоначально отображенные компоненты не были правильно изменены при закрытии начального элемента;
   */

    const mutableContent = [];
    const fillMutableContent = obj => {
      obj.content
        ? obj.content.map(a => (a.content ? fillMutableContent(a) : mutableContent.push(a)))
        : mutableContent.push(obj);
    };

    const newConfig = initConfig;
    fillMutableContent(newConfig);
    mutableContent.forEach(content => {
      const foundItem = widgets.find(item => item.title === content.title);
      if (foundItem) {
        content.component = wrapComponent(foundItem.component);
        content.props = { id: generateUniqueId() };
      }
    });

    return newConfig;
  }, [widgets, initConfig]);

  /**
   * Обработчик вызова контекстного меню
   */
  const handleContextMenu = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      dispatch(setContextMenu());
    },
    [dispatch],
  );

  /**
   * Обработчик onLayoutReady компонента GoldenLayoutComponent
   * @param {{level: any}} param параметры
   */
  const onLayoutReady = param => {
    param.level = level;
    setLayoutManager(param);
    onLayoutManagerReady(param);
  };

  return (
    <S.GlWrapper {...params} onContextMenu={handleContextMenu}>
      {isDev && (
        <ContextMenu componentMenuItems={widgets} addWidget={addWidget} contextMenu={contextMenu} />
      )}
      <GoldenLayoutComponent
        showMaximiseIcon={false}
        config={config}
        autoresize
        debounceResize={100}
        onLayoutReady={val => onLayoutReady(val)}
      />
    </S.GlWrapper>
  );
};

const S = {
  GlWrapper: styled.div`
    width: 100%;
    height: ${props => (props.modal ? '100%' : props.height + 'px')};
  `,
};

GoldenLayoutForm.propTypes = {
  initConfig: pt.object.isRequired,
  modal: pt.bool,
  level: pt.string,
  onLayoutManagerReady: pt.func,
};

export default React.memo(GoldenLayoutForm, isEqual);
