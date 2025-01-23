export const titles = ['Прокси-модели', 'Настройка', 'Компенсация отборов жидкости'];

/**
 * Функция добавляет иконку к табу
 * @param {Object.<string, any>} tab объект таба
 * @param {string} iconSrc ссылка на иконку таба
 */
export const prependIcon = (tab, iconSrc) => {
  const [title] = tab.titleElement[0]?.innerText;
  if (titles.includes(title)) {
    const [elem] = tab.titleElement.parent().parent().parent().children();
    if (elem) {
      elem.children[1].style.display = 'none';
    }
  }
  const hasNoIcon = !tab.titleElement.find('img').length;
  if (hasNoIcon && iconSrc) {
    tab.titleElement.prepend(`
      <img  
        src="${iconSrc}"
        class="gl-tab-icon"
      />  
    `);
  }
};
