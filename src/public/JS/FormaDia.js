var Datos = [];
    const for1=document.getElementById("form");

    let calendar = new Calendar('calendar');

    calendar.getElement().addEventListener('change', e => {
        
        console.log(calendar.value().format('DD/MMMM/YYYY'));
        console.log(calendar.value().format('LLLL'));
        var fech = calendar.value().format('YYYY-MM-DD');
        Datos = [];

        Datos.push({ fecha: fech })

        var d = new Date(fech + " 00:00:00");
        var fech2 = sumarDias(d, 1);
        var fech3 = fech2.format('YYYY-MM-DD') ;
        Datos.push({ fecha: fech3 })
        document.getElementById('Nuevo').value = JSON.stringify(Datos);
        for1.submit();


        //var dateFormat = require('dateformat');
        //var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        //console.log(fech2.toLocaleDateString("es-ES", options))


    });

    function sumarDias(fecha, dias) {
        fecha.setDate(fecha.getDate() + dias);
        return moment(fecha);
    }
