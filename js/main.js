// Addons Table
  $(document).ready(function() {
    $('#addonsTable').DataTable({
      paging: true,
      searching: true,
      info: false,
      ordering: true,          // activar orden
      order: [[1, 'asc']]      // columna 1 (la segunda, porque empieza en 0) → ascendente
    });
  });



// Mounts Table
  $(document).ready(function() {
    $('#mountsTable').DataTable({
      paging: true,
      searching: true,
      info: false,
      ordering: true,          // activar orden
      order: [[1, 'asc']]      // columna 1 (la segunda, porque empieza en 0) → ascendente
    });
  });



// Quest Table
$(document).ready(function() {
  $('#questsTable').DataTable({
    paging: true,
    searching: true,
    info: false,
    ordering: true,
    order: [[2, 'asc'], [0, 'asc']],
    columnDefs: [
      { targets: [0,1,3], className: 'text-start ps-4' },
      { 
        targets: 2, 
        className: 'text-center',
        render: function(data, type) {
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


// Spells Table
$(document).ready(function() {
  var table = $('#spellsTable').DataTable({
    paging: false,  // Sin paginación – todo de una
    searching: true,
    info: false,
    ordering: true,
    order: [[3, 'asc']],  // Ordena por Level ascendente
    columnDefs: [
      { targets: 0, visible: false },  // Oculta la columna Group
      { targets: [2, 5], className: 'text-start' },  // Description y Vocation alineados a la izquierda
      { targets: [3, 4, 6], className: 'text-center' },  // Level, Cooldown e Image centrados
      { 
        targets: 3,  // Level column: sort numérico
        render: function(data, type) {
          if (type === 'sort' || type === 'type') {
            return parseInt(data, 10) || 0;  // Convierte a número para ordenar bien (1, 50, 100)
          }
          return data;
        }
      },
      { targets: 6, orderable: false }  // Image no sortable
    ]
  });

  // Opciones de sub-filtros por grupo (sin "All" – solo specifics)
  var subOptions = {
    'MAGE': [
      { value: 'MAGE-Mage', text: 'Mage' },
      { value: 'MAGE-Priest', text: 'Priest' },
      { value: 'MAGE-Wizard', text: 'Wizard' }
    ],
    'ARCHER': [
      { value: 'ARCHER-Archer', text: 'Archer' },
      { value: 'ARCHER-Assassin', text: 'Assassin' },
      { value: 'ARCHER-Sharpshooter', text: 'Sharpshooter' }
    ],
    'KNIGHT': [
      { value: 'KNIGHT-Knight', text: 'Knight' },
      { value: 'KNIGHT-Berserker', text: 'Berserker' },
      { value: 'KNIGHT-Crusader', text: 'Crusader' }
    ]
  };

  // Filtro principal por grupo (fix: "All" solo exact "ALL")
  $('#groupFilter').on('change', function() {
    var groupVal = this.value;
    var subSelect = $('#subFilter');
    var subContainer = $('#subFilterContainer');

    if (groupVal === 'All') {
      subContainer.hide();
      table.column(0).search('^ALL$', true, false).draw();  // Exacto: solo comunes puros
    } else {
      subContainer.show();
      // Llenar sub-filtro solo con specifics
      subSelect.empty();
      $.each(subOptions[groupVal] || [], function(i, opt) {
        subSelect.append('<option value="' + opt.value + '">' + opt.text + '</option>');
      });
      subSelect.val(subOptions[groupVal][0].value).trigger('change');  // Default al primero (ej: 'Mage')
    }
  });

  // Filtro por sub-vocación (fix: incluye "MAGE-ALL" y multis como "MAGE-Mage MAGE-Wizard")
  $('#subFilter').on('change', function() {
    var subVal = this.value;  // ej: 'MAGE-Mage'
    var group = subVal.split('-')[0];  // 'MAGE'
    var specific = subVal.split('-')[1];  // 'Mage'
    
    // Regex sin anchors: busca el specific O el ALL del grupo (matchea en celdas con múltiples)
    var searchRegex = group + '-(ALL|' + specific + ')';
    table.column(0).search(searchRegex, true, false).draw();
  });

  // Trigger inicial para All (solo comunes)
  $('#groupFilter').trigger('change');
});




// === LOAD NAVBAR ===
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