
document.addEventListener("DOMContentLoaded", async () => {

    const correo = document.getElementById("correo");
    const nombre = document.getElementById("nombre");
    const bienvenida = document.getElementById("nombre-bienvenida");
    const mensaje = document.getElementById("mensaje-perfil");
    const formulario = document.getElementById("form-perfil");
    const guardar = document.getElementById("guardar");
    const cerrarSesion = document.getElementById("cerrar-sesion");

    function mostrarMensaje(texto, error = false) {
        mensaje.textContent = texto;
        mensaje.classList.toggle("error", error);
    }

    // Comprobar usuario
    const { data: { user }, error: errorUsuario } =
        await supabaseClient.auth.getUser();

    if (errorUsuario || !user) {
        window.location.href = "cuenta.html";
        return;
    }

    // Correo fijo
    correo.value = user.email || "";

    // Consultar perfil
    const { data: perfil, error: errorPerfil } =
        await supabaseClient
            .from("perfiles")
            .select("nombre, rol")
            .eq("id", user.id)
            .maybeSingle();

    if (errorPerfil) {
        mostrarMensaje("Error al consultar el perfil: " + errorPerfil.message, true);
        return;
    }

    if (!perfil) {
        mostrarMensaje("No encontramos tu perfil en la base de datos.", true);
        return;
    }

    // Nombre del cliente
    const nombreCliente =
        perfil.nombre?.trim() ||
        user.user_metadata?.nombre?.trim() ||
        "Cliente";

    nombre.value = perfil.nombre || "";
    bienvenida.textContent = `Hola, ${nombreCliente}`;
    // Mostrar panel de administración
const enlaceAdmin = document.getElementById("enlace-admin");

if (perfil.rol === "admin" && enlaceAdmin) {
    enlaceAdmin.hidden = false;
}

    // Guardar cambios
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nuevoNombre = nombre.value.trim();

        if (!nuevoNombre) {
            mostrarMensaje("Escribe un nombre válido.", true);
            return;
        }

        guardar.disabled = true;
        guardar.textContent = "Guardando...";
        mostrarMensaje("Actualizando información...");

        const { data, error } = await supabaseClient
            .from("perfiles")
            .update({ nombre: nuevoNombre })
            .eq("id", user.id)
            .select("id, nombre")
            .maybeSingle();

        if (error) {
            mostrarMensaje("No se pudo guardar: " + error.message, true);

        } else if (!data) {
            mostrarMensaje("No se actualizó ningún registro. Comprueba el perfil y sus permisos.", true);

        } else {
            const { error: errorMetadata } =
                await supabaseClient.auth.updateUser({
                    data: { nombre: nuevoNombre }
                });

            bienvenida.textContent = `Hola, ${data.nombre}`;

            if (errorMetadata) {
                mostrarMensaje("Nombre guardado en tu perfil, pero no se pudo actualizar el dato adicional de la cuenta.", true);
            } else {
                mostrarMensaje("¡Cambios guardados correctamente! 💗");
            }
        }

        guardar.disabled = false;
        guardar.textContent = "Guardar cambios";
    });

    // Cerrar sesión
    cerrarSesion.addEventListener("click", async () => {
        cerrarSesion.disabled = true;

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            mostrarMensaje("No se pudo cerrar sesión: " + error.message, true);
            cerrarSesion.disabled = false;
            return;
        }

        window.location.href = "cuenta.html";
    });

});