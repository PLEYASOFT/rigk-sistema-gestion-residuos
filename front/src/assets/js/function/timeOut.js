var idleTime = 0;
const tiempo = 300000;
$(document).ready(function () {
    //Increment the idle time counter every minute.
    let idleInterval = setInterval(timerIncrement, tiempo); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        clearInterval(idleInterval)
        idleInterval = setInterval(timerIncrement, tiempo);
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        clearInterval(idleInterval)
        idleInterval = setInterval(timerIncrement, tiempo);
        idleTime = 0;
    });
});

function timerIncrement() {
    idleTime = idleTime + 1;
    const sesionData = sessionStorage.getItem('tarjetaUsuario');
    if (sesionData != null) { // 20 minutes
        sessionStorage.clear();
        window.location.reload();
    }
}