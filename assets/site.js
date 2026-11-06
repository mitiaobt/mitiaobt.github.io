// Opens and closes the abstract or course description in each box.
document.addEventListener('click', function (event) {
  var button = event.target.closest('.toggle');
  if (!button) return;
  var panel = document.getElementById(button.getAttribute('aria-controls'));
  var open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  panel.hidden = open;
});

// The Email button copies the address and says so.
// If copying is not possible, it opens the mail app instead.
function copyWithSelection(text) {
  var field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  var copied = false;
  try { copied = document.execCommand('copy'); } catch (error) {}
  field.remove();
  return copied;
}

document.querySelectorAll('[data-copy]').forEach(function (button) {
  var labelEl = button.querySelector('.label');
  var label = labelEl.textContent;
  var timer;

  function confirmCopied() {
    labelEl.textContent = 'Email copied !';
    button.classList.add('copied');
    clearTimeout(timer);
    timer = setTimeout(function () {
      labelEl.textContent = label;
      button.classList.remove('copied');
    }, 2000);
  }

  function fallback() {
    if (copyWithSelection(button.dataset.copy)) confirmCopied();
    else window.location.href = button.href;
  }

  button.addEventListener('click', function (event) {
    event.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(button.dataset.copy).then(confirmCopied, fallback);
    } else {
      fallback();
    }
  });
});

// Circles the menu item of the section being read.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-header nav a'));
  var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); });
  var clicked = null; // stays selected after a click, until the reader scrolls by hand

  function select(index) {
    links.forEach(function (link, i) {
      link.classList.toggle('is-active', i === index);
      if (i === index) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    if (clicked !== null) return select(clicked);
    var current = -1;
    sections.forEach(function (section, i) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.25) current = i;
    });
    var root = document.documentElement;
    var scrollable = root.scrollHeight > window.innerHeight + 2;
    if (scrollable && window.scrollY + window.innerHeight >= root.scrollHeight - 2) current = sections.length - 1;
    select(current);
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function () { clicked = i; select(i); });
  });
  ['wheel', 'touchmove', 'keydown'].forEach(function (name) {
    window.addEventListener(name, function () { clicked = null; }, { passive: true });
  });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
