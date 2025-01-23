import React, { Component, useCallback, useRef } from 'react';
import { generateUniqueId, labelRussianWords } from 'utils/functions';
import pt from 'prop-types';
import isEqual from 'deep-equal';

/**
 * Компонент <GoldenLayoutItemLabel />
 * @param {Object} props props компонента
 * @param {string} props.label лейбл
 * @param {Component} props.component компонент
 * @param {Object.<string, any>} props.layoutManager объект менеджера GoldenLayout
 * @param {Function} props.onCreateElement обработчик создания элемента
 * @returns {JSX.Element}
 */
const GoldenLayoutItemLabel = ({ label, component, layoutManager, onCreateElement }) => {
  const itemRef = useRef();

  /**
   * Обработчик клика по div элементу
   */
  const handleClick = useCallback(() => {
    const id = generateUniqueId();
    layoutManager.root.contentItems[0].addChild(
      {
        component: label,
        type: 'react-component',
        title: labelRussianWords(label),
        props: { id },
      },
      0,
    );
    onCreateElement(label, id, layoutManager);
  }, [label, layoutManager, onCreateElement]);

  return (
    <div ref={itemRef} onClick={handleClick}>
      {labelRussianWords(label)}
    </div>
  );
};

GoldenLayoutItemLabel.propTypes = {
  label: pt.string.isRequired,
  component: pt.any.isRequired,
  layoutManager: pt.any,
  onCreateElement: pt.func.isRequired,
};

export default React.memo(GoldenLayoutItemLabel, isEqual);
