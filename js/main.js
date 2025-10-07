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
