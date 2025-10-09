// === DATATABLES: ADDONS ===
$(document).ready(function () {
  $('#addonsTable').DataTable({
    paging: true,
    searching: true,
    info: false,
    ordering: true,
    order: [[1, 'asc']]
  });
});

// === DATATABLES: MOUNTS ===
$(document).ready(function () {
  $('#mountsTable').DataTable({
    paging: true,
    searching: true,
    info: false,
    ordering: true,
    order: [[1, 'asc']]
  });
});

// === DATATABLES: QUESTS ===
$(document).ready(function () {
  $('#questsTable').DataTable({
    paging: true,
    searching: true,
    info: false,
    ordering: true,
    order: [[2, 'asc'], [0, 'asc']],
    columnDefs: [
      { targets: [0, 1, 3], className: 'text-start ps-4' },
      {
        targets: 2,
        className: 'text-center',
        render: function (data, type) {
          if (type === 'sort' || type === 'type') {
            var m = data.toString().match(/-?\d+/);
            return m ? parseInt(m[0], 10) : 0;
          }
          return data;
        }
      },
      { targets: 3, orderable: false }
    ]
  });
});

// === DATATABLES: SPELLS ===
$(document).ready(function () {
  var table = $('#spellsTable').DataTable({
    paging: false,
    searching: true,
    info: false,
    ordering: true,
    order: [[3, 'asc']],
    columnDefs: [
      { targets: 0, visible: false },
      { targets: [2, 5], className: 'text-start' },
      { targets: [3, 4, 6], className: 'text-center' },
      {
        targets: 3,
        render: function (data, type) {
          if (type === 'sort' || type === 'type') {
            return parseInt(data, 10) || 0;
          }
          return data;
        }
      },
      { targets: 6, orderable: false }
    ]
  });

  var subOptions = {
    MAGE: [
      { value: 'MAGE-Mage', text: 'Mage' },
      { value: 'MAGE-Priest', text: 'Priest' },
      { value: 'MAGE-Wizard', text: 'Wizard' }
    ],
    ARCHER: [
      { value: 'ARCHER-Archer', text: 'Archer' },
      { value: 'ARCHER-Assassin', text: 'Assassin' },
      { value: 'ARCHER-Sharpshooter', text: 'Sharpshooter' }
    ],
    KNIGHT: [
      { value: 'KNIGHT-Knight', text: 'Knight' },
      { value: 'KNIGHT-Berserker', text: 'Berserker' },
      { value: 'KNIGHT-Crusader', text: 'Crusader' }
    ]
  };

  $('#groupFilter').on('change', function () {
    var groupVal = this.value;
    var subSelect = $('#subFilter');
    var subContainer = $('#subFilterContainer');

    if (groupVal === 'All') {
      subContainer.hide();
      table.column(0).search('^ALL$', true, false).draw();
    } else {
      subContainer.show();
      subSelect.empty();
      $.each(subOptions[groupVal] || [], function (i, opt) {
        subSelect.append('<option value="' + opt.value + '">' + opt.text + '</option>');
      });
      subSelect.val(subOptions[groupVal][0].value).trigger('change');
    }
  });

  $('#subFilter').on('change', function () {
    var subVal = this.value;
    var group = subVal.split('-')[0];
    var specific = subVal.split('-')[1];
    var searchRegex = group + '-(ALL|' + specific + ')';
    table.column(0).search(searchRegex, true, false).draw();
  });

  $('#groupFilter').trigger('change');
});

// === LOAD NAVBAR + FOOTER ===
document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;
  const inSubfolder =
    currentPath.includes("/items/") ||
    currentPath.includes("/quests/");

  // Ruta de la navbar
  const navbarPath = inSubfolder ? "../components/navbar.html" : "components/navbar.html";

  fetch(navbarPath)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar la navbar: " + res.status);
      return res.text();
    })
    .then(html => {
      const placeholder = document.getElementById("navbar-placeholder");
      placeholder.innerHTML = html;

      const basePath = inSubfolder ? "../" : "";

      // Corrige todos los links y sus rutas relativas
      placeholder.querySelectorAll("a").forEach(link => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#")) return;

        // Si son páginas de items (gems, stones, crafting), fuerza ../items/
        if (["gems.html", "stones.html", "crafting.html"].includes(href)) {
          link.setAttribute("href", basePath + "items/" + href);
        }
        // En cualquier otro caso, simplemente antepone ../ si hace falta
        else {
          link.setAttribute("href", basePath + href);
        }
      });

      // Corrige imágenes (como el logo)
      placeholder.querySelectorAll("img").forEach(img => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http")) {
          img.setAttribute("src", basePath + src);
        }
      });
    })
    .catch(err => console.error("Error cargando la navbar:", err));
});

// === LOAD FOOTER ===
document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;
  const inSubfolder =
    currentPath.includes("/items/") ||
    currentPath.includes("/quests/");

  // Ruta base (igual que navbar)
  const basePath = inSubfolder ? "../" : "";

  // Ruta del footer
  const footerPath = inSubfolder ? "../components/footer.html" : "components/footer.html";

  fetch(footerPath)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar el footer: " + res.status);
      return res.text();
    })
    .then(html => {
      const placeholder = document.getElementById("footer-placeholder");
      if (placeholder) {  // Solo si existe el placeholder
        placeholder.innerHTML = html;

        // Corrige cualquier link/img en el footer (por si agregás algo después)
        placeholder.querySelectorAll("a").forEach(link => {
          const href = link.getAttribute("href");
          if (!href || href.startsWith("http") || href.startsWith("#")) return;
          link.setAttribute("href", basePath + href);
        });

        placeholder.querySelectorAll("img").forEach(img => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http")) {
            img.setAttribute("src", basePath + src);
          }
        });
      }
    })
    .catch(err => console.error("Error cargando el footer:", err));
});

// === DROPDOWN BEHAVIOR: Hover desktop, click mobile ===
document.addEventListener('DOMContentLoaded', function () {
  const mobileBreakpoint = 992;  // Bootstrap lg breakpoint

  function isMobile() {
    return window.innerWidth < mobileBreakpoint;
  }

  function initDropdowns(root = document) {
    if (typeof bootstrap === 'undefined') return;

    root.querySelectorAll('.nav-item.dropdown').forEach(item => {
      const toggle = item.querySelector('.dropdown-toggle');
      const menu = item.querySelector('.dropdown-menu');
      if (!toggle || !menu) return;

      // Asegura atributos Bootstrap
      if (!toggle.hasAttribute('data-bs-toggle')) toggle.setAttribute('data-bs-toggle', 'dropdown');
      if (!toggle.hasAttribute('href')) toggle.setAttribute('href', '#');
      if (!menu.hasAttribute('aria-labelledby')) {
        const id = toggle.id || 'dd_' + Math.random().toString(36).substr(2, 6);
        toggle.id = id;
        menu.setAttribute('aria-labelledby', id);
      }

      let bsInstance = null;
      try {
        bsInstance = bootstrap.Dropdown.getOrCreateInstance(toggle);
      } catch (e) {
        return;
      }

      // Evita múltiples bindings
      if (toggle.dataset._bsHoverInit === '1') return;
      toggle.dataset._bsHoverInit = '1';

      // Hover en desktop
      item.addEventListener('mouseenter', function () {
        if (!isMobile()) bsInstance.show();
      });
      item.addEventListener('mouseleave', function () {
        if (!isMobile()) bsInstance.hide();
      });
    });
  }

  // Inicializa en navbar y doc completo
  initDropdowns();
  window.addEventListener('resize', initDropdowns);

  // Click fuera cierra en mobile
  document.addEventListener('click', function (e) {
    if (!isMobile()) return;
    if (!e.target.closest('.navbar')) {
      document.querySelectorAll('.navbar .dropdown-menu.show').forEach(m => {
        const p = m.closest('.nav-item.dropdown');
        if (p) {
          const b = p.querySelector('.dropdown-toggle');
          if (b) {
            try { bootstrap.Dropdown.getOrCreateInstance(b).hide(); } catch (err) { m.classList.remove('show'); }
          }
        }
      });
    }
  });
});