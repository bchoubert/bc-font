
let container = null;
let drawer = null;

const printIcon = icon => `<div class="icon-container" data-key="${icon.key}">
      <i class="icon ${icon.icon}"></i>
      <span>${icon.name}</span>
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
  const icon = icons.map(cat => cat.icons).flat(Math.Infinity).filter(ic => ic.key === iconKey)[0];
  const category = icons.filter(category => category.icons.map(icon => icon.key).includes(iconKey))[0];
  if(!icon || !category) {
    console.error('No icon matching ' + iconKey);
    return;
  }
  const associatedIcons = icons.map(cat => cat.icons).flat(Math.infinity).filter(ic => ic.name === icon.name && ic.key !== icon.key);

  document.querySelector('#drawer-name').innerHTML = `
    <span id="drawer-name-icon" ${!!icon.color ? `style="background-color:${icon.color}"` : ''}><i class="icon ${icon.icon}"></i></span>
    <div>
      <h3>
        ${icon.name}
      </h3>
      <span id="drawer-name-category">Category: ${category.name}</span>
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

      ${!!associatedIcons.length ? `
        <div id="associated">
          <h4>Associated Icons:</h4>
          ${associatedIcons.map(icon => `
            <span class="associated-icon" ${!!icon.color ? `style="background-color:${icon.color}"` : ''} data-key="${icon.key}"><i class="icon ${icon.icon}"></i></span>
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
  if(c1.name > c2.name) { return 1 }
  if(c1.name < c2.name) { return -1 }
  return 0;
};

const registerIconListEvents = () => {
  document.querySelectorAll('.icon-container').forEach(icon => icon.addEventListener('click', function() {
    openDrawer(this.getAttribute('data-key'));
  }));
};

const showIcons = icons => {
  container.innerHTML = icons.sort(iconComparator).map(printIcon).join('');
};

const loadCategory = category => {
  if(category === 'all') {
    showIcons(icons.map(category => category.icons).flat(Math.infinity));
  }
  else {
    if(!!icons.filter(iconCategory => iconCategory.id === category).length) {
      showIcons(icons.filter(iconCategory => iconCategory.id === category)[0].icons);
    }
    else {
      console.error('Unknown category : ' + category);
      return;
    }
  }
  registerIconListEvents();
};

(() => {
  document.querySelector('#icon-number').innerHTML = icons.map(category => category.icons).flat(Math.Infinity).length;
  container = document.querySelector('#container');
  drawer = document.querySelector('#drawer');

  document.querySelector('#drawer-close').addEventListener('click', closeDrawer);

  document.querySelector('#categories').innerHTML = `
    <option value="all">All</option>
    ${icons.sort(categoryComparator).map(category => `<option value="${category.id}">${category.name}</option>`).join('')}`;

  document.querySelector('#categories').addEventListener('change', e => {
    loadCategory(document.querySelector('#categories').value);
  });

  loadCategory('all');
})();
