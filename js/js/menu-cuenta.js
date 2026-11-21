document.addEventListener("DOMContentLoaded", async () => {

    const enlaceCuenta = document.getElementById("enlace-cuenta");

    if (!enlaceCuenta) return;

    function actualizarCuenta(session) {

        if (session?.user) {
            enlaceCuenta.textContent = "Mi cuenta";
            enlaceCuenta.href = "perfil.html";
        } else {
            enlaceCuenta.textContent = "Iniciar sesión";
            enlaceCuenta.href = "cuenta.html";
        }

    }

    const { data: { session }, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error("Error al verificar la sesión:", error);
    }

    actualizarCuenta(session);

    supabaseClient.auth.onAuthStateChange((_event, nuevaSesion) => {
        actualizarCuenta(nuevaSesion);
    });

});