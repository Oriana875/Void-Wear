
document.addEventListener("DOMContentLoaded", async () => {

    // Cargar la ventana de VOID AI
    try {
        const respuestaHTML = await fetch("void-ai.html");

        if (!respuestaHTML.ok) {
            throw new Error("No se encontró void-ai.html");
        }

        const html = await respuestaHTML.text();

        const contenedor = document.createElement("div");
        contenedor.innerHTML = html;

        document.body.appendChild(contenedor);

        // Cargar estilos
        const estilos = document.createElement("link");
        estilos.rel = "stylesheet";
        estilos.href = "css/void-ai.css";
        document.head.appendChild(estilos);

    } catch (error) {
        console.error("Error al cargar VOID AI:", error);
        return;
    }

    const boton = document.getElementById("void-ai-button");
    const ventana = document.getElementById("void-ai-window");
    const cerrar = document.getElementById("void-ai-close");
    const formulario = document.getElementById("void-ai-form");
    const entrada = document.getElementById("void-ai-input");
    const mensajes = document.getElementById("void-ai-messages");
    const enviar = document.getElementById("void-ai-send");

    // Abrir y cerrar chat
    boton.addEventListener("click", () => {
        ventana.classList.toggle("abierto");
    });

    cerrar.addEventListener("click", () => {
        ventana.classList.remove("abierto");
    });

    // Mostrar mensajes
    function agregarMensaje(texto, tipo) {
        const mensaje = document.createElement("div");

        mensaje.className = `void-ai-message ${tipo}`;
        mensaje.textContent = texto;

        mensajes.appendChild(mensaje);
        mensajes.scrollTop = mensajes.scrollHeight;

        return mensaje;
    }

    // Enviar mensajes a Ollama
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const texto = entrada.value.trim();

        if (!texto) return;

        agregarMensaje(texto, "user");

        entrada.value = "";
        enviar.disabled = true;

        const cargando = agregarMensaje(
            "VOID AI está pensando... 💗",
            "bot"
        );

        try {
            const respuesta = await fetch(
                "http://localhost:3000/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mensaje: texto
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || "Error al responder");
            }

            cargando.textContent =
                datos.respuesta || "No recibí una respuesta.";

        } catch (error) {
            cargando.textContent =
                "No pude conectarme. Comprueba que el servidor de VOID AI esté funcionando.";

            console.error(error);

        } finally {
            enviar.disabled = false;
            entrada.focus();
            mensajes.scrollTop = mensajes.scrollHeight;
        }
    });

});
