    var boton = document.getElementById('boton');
    var IdBoton = document.getElementById('idBoton');
    var singin = document.getElementById('singin');
    
    function comenzar() {
        console.log("Clave: ");

        boton.addEventListener('click', evento, false);
    }
    function evento(e) {
        console.log("e" + e);
        boton.style.display = 'none';
        IdBoton.innerHTML += "<button class='btn btn-success btn-block'  type='button' id='boton'><span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>loading</button>"
        setTimeout(function(){
        submitBt()
        },10,"JavaScript");


        console.log('Si entro')
        
    }
    function submitBt(){
        singin.submit();
    }
    window.addEventListener("load", comenzar, false);
