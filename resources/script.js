
let container = null;
let drawer = null;

const printIcon = iconKey => `<div class="icon-container ${EIcons[iconKey].new ? 'icon-container--new' : ''}" data-key="${iconKey}">
      <i class="icon ${EIcons[iconKey].icon}"></i>
      <span>${EIcons[iconKey].name}</span>
    </div>`;

const copyToClipboard = text => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const registerIconEvents = () => {
  document.querySelectorAll('.to_clipboard').forEach(btn => {
    btn.addEventListener('click', function() {
      copyToClipboard(this.getAttribute('data-copy'));
    });
  });
  document.querySelectorAll('.associated-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      openDrawer(this.getAttribute('data-key'));
    });
  });
};

const closeDrawer = () => drawer.classList.remove('drawer--open');

const openDrawer = iconKey => {
  const icon = EIcons[iconKey];
  
  if(!icon) {
    console.error('No icon matching ' + iconKey);
    return;
  }

  const categoryKeys = EIcons[iconKey].categories;
  const associatedIconKeys = Object.keys(EIcons).filter(associatedIconKey => EIcons[associatedIconKey].name === icon.name && iconKey !== associatedIconKey);

  document.querySelector('#drawer-name').innerHTML = `
    <span id="drawer-name-icon" ${!!icon.color ? `style="background-color:${icon.color}"` : ''}><i class="icon ${icon.icon}"></i></span>
    <div>
      <h3>
        ${icon.name}
      </h3>
      <span id="drawer-name-category">Categories: ${categoryKeys.map(categoryKey => ECategoryDetails[categoryKey].title)}</span>
      ${!!icon.color ? `<span>Official color: <span style="color: ${icon.color}">${icon.color}</span></span>
      <button class="to_clipboard" data-copy="${icon.color}"><img src="resources/images/copy.svg" /></button>` : ''}
    </div>`;

  document.querySelector('#drawer-usage').innerHTML = `
    <div>
      <h4>Copy this into your HTML:</h4>
      <span id="drawer-usage-code">
        <pre style="color:#007700">&lt;i</pre>
        <pre style="color:#0000CC">class</pre>=<pre></pre><!--
        --><pre style="background-color: #FFF0F0">"icon ${icon.icon}"</pre><!--
        --><pre style="color:#007700">&gt;&lt;i&gt;</pre>
      </span>
      <button class="to_clipboard" data-copy="<i class='icon ${icon.icon}'></i>"><img src="resources/images/copy.svg" /></button>

      ${associatedIconKeys.length ? `
        <div id="associated">
          <h4>Associated Icons:</h4>
          ${associatedIconKeys.map(iconKey => `
            <span class="associated-icon" ${EIcons[iconKey].color ? `style="background-color:${EIcons[iconKey].color}"` : ''} data-key="${iconKey}"><i class="icon ${EIcons[iconKey].icon}"></i></span>
          `).join('')}
        </div>
      ` : ''}

    </div>`;

  drawer.classList.add('drawer--open');
  registerIconEvents();
};

const iconComparator = (i1, i2) => {
  if(i1.key > i2.key) { return 1 }
  if(i1.key < i2.key) { return -1 }
  return 0;
};

const categoryComparator = (c1, c2) => {
  if(ECategoryDetails[c1].title > ECategoryDetails[c2].title) { return 1 }
  if(ECategoryDetails[c1].title < ECategoryDetails[c2].title) { return -1 }
  return 0;
};

const registerIconListEvents = () => {
  document.querySelectorAll('.icon-container').forEach(icon => icon.addEventListener('click', function() {
    openDrawer(this.getAttribute('data-key'));
  }));
};

const showIcons = iconKeys => {
  container.innerHTML = iconKeys.sort(iconComparator).map(printIcon).join('');
};

const loadCategory = categoryKey => {
  if(categoryKey === '') {
    showIcons(Object.keys(EIcons));
  }
  else {
    showIcons(Object.keys(EIcons).filter(iconKey => EIcons[iconKey].categories.includes(categoryKey)));
  }
  registerIconListEvents();
};

(() => {
  document.querySelector('#icon-number').innerHTML = Object.keys(EIcons).length;
  container = document.querySelector('#container');
  drawer = document.querySelector('#drawer');

  document.querySelector('#drawer-close').addEventListener('click', closeDrawer);

  document.querySelector('#categories').innerHTML = `
    <option value="all">All</option>
    ${Object.keys(ECategory).sort(categoryComparator).map(categoryKey => `<option value="${categoryKey}">${ECategoryDetails[categoryKey].title}</option>`).join('')}`;

  document.querySelector('#categories').addEventListener('change', e => {
    loadCategory(document.querySelector('#categories').value);
  });

  loadCategory('');
})();
