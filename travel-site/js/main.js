(function () {
  // Sticky header solid state
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add('solid');
    else header.classList.remove('solid');

    var track = document.getElementById('progressFill');
    if (track) {
      var article = document.querySelector('.article-content');
      if (article) {
        var rect = article.getBoundingClientRect();
        var total = article.offsetHeight - window.innerHeight * 0.5;
        var scrolled = -rect.top;
        var pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
        track.style.height = pct + '%';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burgerBtn');
  var panel = document.getElementById('mobilePanel');
  var closeBtn = document.getElementById('mobileClose');
  if (burger && panel) {
    burger.addEventListener('click', function () { panel.classList.add('open'); document.body.style.overflow = 'hidden'; });
  }
  if (closeBtn && panel) {
    closeBtn.addEventListener('click', function () { panel.classList.remove('open'); document.body.style.overflow = ''; });
  }
  if (panel) {
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { panel.classList.remove('open'); document.body.style.overflow = ''; });
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Destination hub: single filter row (data-tag)
  var filterRow = document.getElementById('filterRow');
  var storyGrid = document.getElementById('storyGrid');
  if (filterRow && storyGrid && !document.getElementById('countryFilterRow')) {
    filterRow.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterRow.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var tag = btn.getAttribute('data-tag');
      storyGrid.querySelectorAll('.card').forEach(function (card) {
        if (tag === 'all' || (card.getAttribute('data-tags') || '').indexOf(tag) > -1) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Journal page: country + tag filters combined
  var countryRow = document.getElementById('countryFilterRow');
  var tagRow = document.getElementById('tagFilterRow');
  if (countryRow && tagRow && storyGrid) {
    var activeCountry = 'all';
    var activeTag = 'all';
    function applyFilters() {
      storyGrid.querySelectorAll('.card').forEach(function (card) {
        var country = card.getAttribute('data-country');
        var tags = card.getAttribute('data-tags') || '';
        var okCountry = activeCountry === 'all' || country === activeCountry;
        var okTag = activeTag === 'all' || tags.indexOf(activeTag) > -1;
        card.style.display = (okCountry && okTag) ? '' : 'none';
      });
    }
    countryRow.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      countryRow.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeCountry = btn.getAttribute('data-country');
      applyFilters();
    });
    tagRow.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      var was = btn.classList.contains('active');
      tagRow.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      if (!was) {
        btn.classList.add('active');
        activeTag = btn.getAttribute('data-tag');
      } else {
        activeTag = 'all';
      }
      applyFilters();
    });
  }
})();
