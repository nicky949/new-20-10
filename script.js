// script.js - load names and wire up interactions
(function () {
  const DATA_URL = './data/names.json';

  // normalize strings for case-insensitive matching
  function normalize(s) {
    return s ? s.trim().toLowerCase() : '';
  }

  async function fetchNames() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error('Failed to load data');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function createPicker(names) {
    const container = document.createElement('div');
    container.className = 'name-picker';

    const title = document.createElement('div');
    title.className = 'name-picker__title';
    title.textContent = 'Chọn tên để gửi lời chúc:';
    container.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'name-picker__list';

    names.forEach((n) => {
      const li = document.createElement('li');
      li.className = 'name-picker__item';
      li.tabIndex = 0;
      li.dataset.id = n.id;
      li.textContent = n.name;
      li.addEventListener('click', () => onSelect(n));
      li.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') onSelect(n);
      });
      list.appendChild(li);
    });

    container.appendChild(list);
    return container;
  }

  function onSelect(person) {
    // update header text message
    const header = document.querySelector('.header-text');
    if (header) {
      header.innerHTML = `<span class="wish">${person.message}</span>`;
    }

    // remove any previous theme classes from body
    document.body.classList.remove('theme-hanh', 'theme-my', 'theme-thuy');
    if (person.theme) document.body.classList.add(person.theme);
  }

  // initialize
  async function init() {
    const names = await fetchNames();
    if (!names || !names.length) return;

    const picker = createPicker(names);
    // insert picker after header-text for visibility
    const header = document.querySelector('.header-text');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(picker, header.nextSibling);
    } else {
      document.body.insertBefore(picker, document.body.firstChild);
    }

    // make first available selection default (optional)
    // onSelect(names[0]);
  }

  // run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
