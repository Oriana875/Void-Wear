
/* =========================================================
   VOID WEAR — CUENTA.JS
   Registro + Inicio de sesión + Recuperación
   Redirección automática después del login
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const mensajeCuenta =
    document.getElementById("cuenta-mensaje");

const tabLogin =
    document.getElementById("tab-login");

const tabRegistro =
    document.getElementById("tab-registro");

const formLogin =
    document.getElementById("form-login");

const formRegistro =
    document.getElementById("form-registro");


/* =========================================================
   MENSAJES
   ========================================================= */

function mostrarMensaje(mensaje, error = false) {

    if (!mensajeCuenta) return;

    mensajeCuenta.textContent = mensaje;

    mensajeCuenta.style.color =
        error ? "#C0395B" : "#743A58";

}


/* =========================================================
   DESTINO DESPUÉS DEL LOGIN
   ========================================================= */

function obtenerDestino() {

    const parametros =
        new URLSearchParams(window.location.search);

    const destinoURL =
        parametros.get("redirect");

    const destinoGuardado =
        sessionStorage.getItem("voidwear_destino_login");

    const destino =
        destinoURL || destinoGuardado;

    sessionStorage.removeItem(
        "voidwear_destino_login"
    );

    if (!destino) {
        return "perfil.html";
    }

    try {

        const url = new URL(
            destino,
            window.location.origin
        );

        // Evitar redirecciones a páginas externas.
        if (url.origin !== window.location.origin) {
            return "perfil.html";
        }

        // Evitar regresar a la propia página de cuenta.
        if (
            url.pathname.endsWith("/cuenta.html") ||
            url.pathname.endsWith("cuenta.html")
        ) {
            return "perfil.html";
        }

        return url.pathname + url.search + url.hash;

    } catch (error) {

        console.error(
            "Error obteniendo destino:",
            error
        );

        return "perfil.html";

    }

}


function regresarAlDestino() {

    const destino = obtenerDestino();

    window.location.replace(destino);

}


/* =========================================================
   CAMBIAR FORMULARIOS
   ========================================================= */

function cambiarFormulario(tipo) {

    const registro = tipo === "registro";

    if (
        !tabLogin ||
        !tabRegistro ||
        !formLogin ||
        !formRegistro
    ) return;

    tabLogin.classList.toggle(
        "activo",
        !registro
    );

    tabRegistro.classList.toggle(
        "activo",
        registro
    );

    formLogin.classList.toggle(
        "activo",
        !registro
    );

    formRegistro.classList.toggle(
        "activo",
        registro
    );

    mostrarMensaje("");

}


if (tabLogin) {

    tabLogin.addEventListener("click", () => {

        cambiarFormulario("login");

    });

}


if (tabRegistro) {

    tabRegistro.addEventListener("click", () => {

        cambiarFormulario("registro");

    });

}


/* =========================================================
   REGISTRO
   ========================================================= */

if (formRegistro) {

    formRegistro.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            const boton =
                formRegistro.querySelector(
                    "button[type='submit']"
                );

            if (boton) {
                boton.disabled = true;
            }

            mostrarMensaje("Creando tu cuenta...");

            try {

                const nombre =
                    document.getElementById(
                        "registro-nombre"
                    ).value.trim();

                const email =
                    document.getElementById(
                        "registro-email"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "registro-password"
                    ).value;

                if (!nombre || !email || !password) {

                    throw new Error(
                        "Completa todos los campos."
                    );

                }

                const { data, error } =
                    await supabaseClient.auth.signUp({

                        email,

                        password,

                        options: {

                            data: {
                                nombre: nombre
                            },

                            emailRedirectTo:
                                window.location.origin +
                                "/cuenta.html"

                        }

                    });

                if (error) throw error;

                if (data.session) {

                    mostrarMensaje(
                        "¡Cuenta creada! Bienvenido a VOID WEAR."
                    );

                    setTimeout(() => {

                        regresarAlDestino();

                    }, 1000);

                } else {

                    mostrarMensaje(
                        "¡Registro iniciado! Revisa tu correo para confirmar tu cuenta."
                    );

                }

                formRegistro.reset();

            } catch (error) {

                console.error(
                    "Error en registro:",
                    error
                );

                mostrarMensaje(
                    error.message,
                    true
                );

            } finally {

                if (boton) {
                    boton.disabled = false;
                }

            }

        }

    );

}


/* =========================================================
   INICIAR SESIÓN
   ========================================================= */

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            const boton =
                formLogin.querySelector(
                    "button[type='submit']"
                );

            if (boton) {
                boton.disabled = true;
            }

            mostrarMensaje("Iniciando sesión...");

            try {

                const email =
                    document.getElementById(
                        "login-email"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "login-password"
                    ).value;

                if (!email || !password) {

                    throw new Error(
                        "Escribe tu correo y contraseña."
                    );

                }

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({

                        email,
                        password

                    });

                if (error) throw error;

                mostrarMensaje(
                    "¡Bienvenido a VOID WEAR!"
                );

                setTimeout(() => {

                    regresarAlDestino();

                }, 700);

            } catch (error) {

                console.error(
                    "Error iniciando sesión:",
                    error
                );

                mostrarMensaje(
                    error.message,
                    true
                );

            } finally {

                if (boton) {
                    boton.disabled = false;
                }

            }

        }

    );

}


/* =========================================================
   RECUPERAR CONTRASEÑA
   ========================================================= */

const botonRecuperar =
    document.getElementById(
        "recuperar-password"
    );

if (botonRecuperar) {

    botonRecuperar.addEventListener(
        "click",
        async () => {

            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();

            if (!email) {

                mostrarMensaje(
                    "Primero escribe tu correo electrónico.",
                    true
                );

                return;

            }

            try {

                botonRecuperar.disabled = true;

                mostrarMensaje(
                    "Enviando instrucciones..."
                );

                const { error } =
                    await supabaseClient.auth.resetPasswordForEmail(
                       

                        email,

                        {
                            redirectTo:
                                window.location.origin +
                                "/cuenta.html"
                        }

                    );

                if (error) throw error;

                mostrarMensaje(
                    "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña."
                );

            } catch (error) {

                console.error(
                    "Error recuperando contraseña:",
                    error
                );

                mostrarMensaje(
                    error.message,
                    true
                );

            } finally {

                botonRecuperar.disabled = false;

            }

        }

    );

}


/* =========================================================
   FIN
   ========================================================= */
