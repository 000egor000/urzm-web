import React, { useEffect } from 'react';
import pt from 'prop-types';
import isEqual from 'deep-equal';
import { IconsSources } from 'constants/tabIconsSources';
import { prependIcon } from './utils';

/**
 * Компонент <GoldenLayoutItemWrapper />
 * @param {Object} props props компонента
 * @param {Object.<string, any>} props.goldenLayout объект goldenLayout
 * @param {Function} props.render функция рендера
 * @param {Object} props.otherProps прочие свойства компонента
 * @returns {JSX.Element}
 */
const GoldenLayoutItemWrapper = ({
  goldenLayout: {
    id,
    glEventEmitter: eventEmitter,
    glEventHub: eventHub,
    connectedTo: initialConnected,
    glContainer: container,
    ...goldenLayoutProps
  },
  render,
  ...otherProps
}) => {
  useEffect(() => {
    // Adds an icon to the GL tab titl
    const label = container.parent.config.title;
    const iconSrc = IconsSources[label];

    prependIcon(container.tab, iconSrc);
    const tabHandler = tab => prependIcon(tab, iconSrc);
    container.on('tab', tabHandler);

    return () => container.off('tab', tabHandler);
  }, [container]);

  return (
    <>
      {render({
        id,
        eventEmitter,
        container,
        eventHub,
        ...goldenLayoutProps,
        ...otherProps,
      })}
    </>
  );
};

GoldenLayoutItemWrapper.propTypes = {
  render: pt.func.isRequired,
  goldenLayout: pt.shape({
    id: pt.string,
    glEventEmitter: pt.string,
    connectedTo: pt.string,
    glEventHub: pt.any.isRequired,
    glContainer: pt.any.isRequired,
  }),
};

export default React.memo(GoldenLayoutItemWrapper, isEqual);
