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
    paging: true,
    searching: true,
    info: false,
    ordering: true,
    order: [[3, 'asc']],  // Ordena por Level ascendente
    columnDefs: [
      { targets: 0, visible: false },  // Oculta la columna Group
      { targets: [2, 5], className: 'text-start' },  // Description y Vocation alineados a la izquierda
      { targets: [3, 4, 6], className: 'text-center' },  // Level, Cooldown e Image centrados
      { targets: 6, orderable: false }  // Image no sortable
    ]
    // Removí drawCallback: no más scroll suave en paginación/filtros
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

  // Filtro por sub-vocación
  $('#subFilter').on('change', function() {
    var subVal = this.value;
    table.column(0).search(subVal, false, false).draw();
  });

  // Trigger inicial para All (solo comunes)
  $('#groupFilter').trigger('change');
});