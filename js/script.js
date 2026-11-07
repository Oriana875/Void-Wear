
/* =========================================================
   VOIDWEAR — JAVASCRIPT OFICIAL
   Inicio + Productos + Diseños + Carrito + Autenticación
   ========================================================= */


/* =========================================================
   DATOS
   ========================================================= */

const PRODUCTOS = {

    "Oversize Essential": {
        precio: 35000,
        imagen: "img/camiseta.png",
        categoria: "oversize",
        tipo: "Camiseta"
    },

    "Oversize Graphic": {
        precio: 42000,
        imagen: "img/camiseta.png",
        categoria: "oversize",
        tipo: "Camiseta"
    },

    "Oversize Basic": {
        precio: 32000,
        imagen: "img/camiseta.png",
        categoria: "oversize",
        tipo: "Camiseta"
    },

    "Baby Tee": {
        precio: 30000,
        imagen: "img/prenda-top.png",
        categoria: "oversize",
        tipo: "Top"
    },

    "Crop Oversize": {
        precio: 34000,
        imagen: "img/prenda-top.png",
        categoria: "oversize",
        tipo: "Top"
    },

    "Essential Hoodie": {
        precio: 75000,
        imagen: "img/hoodie.png",
        categoria: "hoodies",
        tipo: "Hoodie"
    },

    "Graphic Hoodie": {
        precio: 85000,
        imagen: "img/hoodie.png",
        categoria: "hoodies",
        tipo: "Hoodie"
    },

    "Premium Hoodie": {
        precio: 95000,
        imagen: "img/hoodie.png",
        categoria: "hoodies",
        tipo: "Hoodie"
    },

    "Zip Hoodie": {
        precio: 88000,
        imagen: "img/hoodie.png",
        categoria: "hoodies",
        tipo: "Hoodie"
    },

    "Cargo Classic": {
        precio: 70000,
        imagen: "img/cargo.png",
        categoria: "cargos",
        tipo: "Cargo"
    },

    "Cargo Wide": {
        precio: 78000,
        imagen: "img/cargo.png",
        categoria: "cargos",
        tipo: "Cargo"
    },

    "Cargo Urban": {
        precio: 82000,
        imagen: "img/cargo.png",
        categoria: "cargos",
        tipo: "Cargo"
    },

    "Parachute Pants": {
        precio: 80000,
        imagen: "img/prenda-bottom.png",
        categoria: "cargos",
        tipo: "Pants"
    },

    "VOIDWEAR Cap": {
        precio: 28000,
        imagen: null,
        categoria: "accesorios",
        tipo: "Accesorio"
    },

    "Urban Beanie": {
        precio: 25000,
        imagen: null,
        categoria: "accesorios",
        tipo: "Accesorio"
    },

    "Tote Bag": {
        precio: 30000,
        imagen: null,
        categoria: "accesorios",
        tipo: "Accesorio"
    }

};


const DISEÑOS = {

    "Night City": "img/night-city.png",
    "Cross Heart": "img/cross-heart.png",
    "Smile Fade": "img/smile-fade.png",
    "Abstract Bloom": "img/abstract-bloom.png",
    "Star Signal": "img/diseno_1_star.png",
    "Flame Theory": "img/diseno_3_flame.png",

    "Butterfly Code": null,
    "Broken Heart": null

};


const COLORES = {

    "Negro": "brightness(.28) saturate(.65)",
    "Blanco": "brightness(0) invert(1)",
    "Rosa": "sepia(.15) saturate(1.9) hue-rotate(295deg) brightness(1.02)",
    "Azul": "sepia(.25) saturate(1.25) hue-rotate(170deg) brightness(.95)",
    "Verde": "sepia(.18) saturate(.9) hue-rotate(75deg) brightness(.95)",
    "Beige": "sepia(.35) saturate(.65) hue-rotate(350deg) brightness(1.04)"

};


const TALLAS = ["XS", "S", "M", "L", "XL"];


/* =========================================================
   ESTADO DEL PERSONALIZADOR
   ========================================================= */

let personalizacion = {

    producto: "Oversize Essential",
    diseño: "Night City",
    talla: "M",
    color: "Negro",
    ubicacion: "Centro",
    cantidad: 1

};


/* =========================================================
   UTILIDADES
   ========================================================= */

function formatearPrecio(numero) {

    return "$" + Number(numero).toLocaleString("es-CO");

}


function mostrarNotificacion(mensaje) {

    const notificacion =
        document.getElementById("notificacion");

    if (!notificacion) return;

    notificacion.textContent = mensaje;

    notificacion.classList.add("activa");

    clearTimeout(window.timerNotificacion);

    window.timerNotificacion = setTimeout(() => {

        notificacion.classList.remove("activa");

    }, 2800);

}


/* =========================================================
   AUTENTICACIÓN Y PROTECCIÓN
   ========================================================= */

function obtenerDestinoActual() {

    return window.location.pathname +
        window.location.search +
        window.location.hash;

}


async function verificarSesion() {

    try {

        if (typeof supabaseClient === "undefined") {
            console.error("Supabase no está cargado.");
            return false;
        }

        const { data, error } =
            await supabaseClient.auth.getSession();

        if (error) throw error;

        return !!data.session;

    } catch (error) {

        console.error("Error verificando sesión:", error);

        return false;

    }

}


async function exigirSesion() {

    const tieneSesion = await verificarSesion();

    if (tieneSesion) return true;

    const destino = obtenerDestinoActual();

    sessionStorage.setItem(
        "voidwear_destino_login",
        destino
    );

    window.location.href =
        "cuenta.html?redirect=" +
        encodeURIComponent(destino);

    return false;

}


/* =========================================================
   MENÚ
   ========================================================= */

function inicializarMenu() {

    const botonMenu =
        document.getElementById("menu-btn");

    const nav =
        document.getElementById("site-nav");

    if (!botonMenu || !nav) return;

    botonMenu.addEventListener("click", () => {

        nav.classList.toggle("activo");

    });

    nav.querySelectorAll("a").forEach(enlace => {

        enlace.addEventListener("click", () => {

            nav.classList.remove("activo");

        });

    });

}


function marcarNavActivo() {

    const pagina =
        location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(
        ".site-header nav a"
    ).forEach(enlace => {

        const href =
            enlace.getAttribute("href");

        if (!href) return;

        const archivo =
            href.split("#")[0];

        if (archivo === pagina) {

            enlace.classList.add("activo");

        }

    });

}


/* =========================================================
   CARRITO
   ========================================================= */

const CLAVE_CARRITO = "VOIDWEARCarrito";

let carrito = [];


try {

    carrito =
        JSON.parse(
            localStorage.getItem(CLAVE_CARRITO)
        ) || [];

    if (!Array.isArray(carrito)) {
        carrito = [];
    }

} catch {

    carrito = [];

}


function guardarCarrito() {

    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );

    actualizarContadorCarrito();

}


function crearClaveItem(item) {

    return [

        item.producto || "",
        item.diseño || "",
        item.color || "",
        item.talla || "",
        item.ubicacion || ""

    ].join("|");

}


async function agregarAlCarrito(item) {

    if (!(await exigirSesion())) return false;

    const clave = crearClaveItem(item);

    const existente = carrito.find(
        producto => crearClaveItem(producto) === clave
    );

    if (existente) {

        existente.cantidad =
            Number(existente.cantidad || 0) +
            Number(item.cantidad || 1);

    } else {

        carrito.push({
            ...item,
            cantidad: Number(item.cantidad || 1)
        });

    }

    guardarCarrito();

    renderizarCarrito();

    mostrarNotificacion(
        `${item.producto} fue añadido al carrito 🛍️`
    );

    return true;

}


function actualizarContadorCarrito() {

    const contador =
        document.getElementById("contador-carrito");

    if (!contador) return;

    const total =
        carrito.reduce(
            (suma, item) =>
                suma + Number(item.cantidad || 0),
            0
        );

    contador.textContent = total;

    contador.style.display =
        total > 0 ? "flex" : "none";

}


function eliminarDelCarrito(indice) {

    if (!carrito[indice]) return;

    carrito.splice(indice, 1);

    guardarCarrito();

    renderizarCarrito();

    mostrarNotificacion(
        "Producto eliminado del carrito ✦"
    );

}


function cambiarCantidadCarrito(indice, cambio) {

    if (!carrito[indice]) return;

    const cantidadActual =
        Number(carrito[indice].cantidad || 1);

    const nuevaCantidad =
        cantidadActual + cambio;

    if (nuevaCantidad <= 0) {

        carrito.splice(indice, 1);

    } else {

        carrito[indice].cantidad = nuevaCantidad;

    }

    guardarCarrito();

    renderizarCarrito();

}


function abrirCarrito() {

    const drawer =
        document.getElementById("carrito-drawer");

    const overlay =
        document.getElementById("overlay");

    if (!drawer || !overlay) return;

    drawer.classList.add("activo");

    overlay.classList.add("activo");

}


function cerrarCarrito() {

    const drawer =
        document.getElementById("carrito-drawer");

    const overlay =
        document.getElementById("overlay");

    if (!drawer || !overlay) return;

    drawer.classList.remove("activo");

    overlay.classList.remove("activo");

}


function renderizarCarrito() {

    const contenedor =
        document.getElementById("carrito-items");

    const totalElemento =
        document.getElementById("carrito-total");

    if (!contenedor) return;

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <span>♡</span>

                <h3>Tu carrito está vacío</h3>

                <p>
                    Empieza a crear algo que sea muy tú.
                </p>

            </div>

        `;

        if (totalElemento) {
            totalElemento.textContent = "$0";
        }

        return;

    }

    let total = 0;

    contenedor.innerHTML =
        carrito.map((item, indice) => {

            const cantidad =
                Number(item.cantidad || 1);

            const subtotal =
                Number(item.precio || 0) * cantidad;

            total += subtotal;

            const imagen =
                item.imagen

                    ? `
                        <img
                            src="${item.imagen}"
                            alt="${item.producto}"
                        >
                    `

                    : `
                        <span style="font-size:2rem;">
                            ✦
                        </span>
                    `;

            const detalles = [

                item.color,
                item.talla,
                item.diseño,
                item.ubicacion

            ].filter(Boolean).join(" · ");

            return `

                <article class="carrito-item">

                    <div class="carrito-item-imagen">
                        ${imagen}
                    </div>

                    <div class="carrito-item-info">

                        <h3>${item.producto}</h3>

                        <p>${detalles}</p>

                        <div class="carrito-cantidad">

                            <button
                                type="button"
                                data-carrito-menos="${indice}">
                                −
                            </button>

                            <strong>${cantidad}</strong>

                            <button
                                type="button"
                                data-carrito-mas="${indice}">
                                +
                            </button>

                        </div>

                    </div>

                    <div>

                        <div class="carrito-item-precio">
                            ${formatearPrecio(subtotal)}
                        </div>

                        <button
                            type="button"
                            class="eliminar-item"
                            data-eliminar-item="${indice}">
                            Eliminar
                        </button>

                    </div>

                </article>

            `;

        }).join("");

    if (totalElemento) {

        totalElemento.textContent =
            formatearPrecio(total);

    }

    contenedor.querySelectorAll(
        "[data-carrito-menos]"
    ).forEach(boton => {

        boton.addEventListener("click", () => {

            cambiarCantidadCarrito(
                Number(boton.dataset.carritoMenos),
                -1
            );

        });

    });

    contenedor.querySelectorAll(
        "[data-carrito-mas]"
    ).forEach(boton => {

        boton.addEventListener("click", () => {

            cambiarCantidadCarrito(
                Number(boton.dataset.carritoMas),
                1
            );

        });

    });

    contenedor.querySelectorAll(
        "[data-eliminar-item]"
    ).forEach(boton => {

        boton.addEventListener("click", () => {

            eliminarDelCarrito(
                Number(boton.dataset.eliminarItem)
            );

        });

    });

}


function inicializarCarrito() {

    const abrir =
        document.getElementById("abrir-carrito");

    const cerrar =
        document.getElementById("cerrar-carrito");

    const overlay =
        document.getElementById("overlay");

    if (abrir) {

        abrir.addEventListener("click", abrirCarrito);

    }

    if (cerrar) {

        cerrar.addEventListener("click", cerrarCarrito);

    }

    if (overlay) {

        overlay.addEventListener("click", cerrarCarrito);

    }

    actualizarContadorCarrito();

    renderizarCarrito();

}


function animarCarrito() {

    const boton =
        document.getElementById("abrir-carrito");

    if (!boton || !boton.animate) return;

    boton.animate(

        [
            { transform: "scale(1)" },
            { transform: "scale(1.15)" },
            { transform: "scale(1)" }
        ],

        {
            duration: 400,
            easing: "ease-out"
        }

    );

}


/* =========================================================
   PRODUCTOS
   ========================================================= */

function inicializarProductos() {

    const tarjetas =
        document.querySelectorAll(".producto-card");

    if (!tarjetas.length) return;

    document.querySelectorAll(
        ".producto-card .agregar-carrito"
    ).forEach(boton => {

        boton.addEventListener("click", async () => {

            const tarjeta =
                boton.closest(".producto-card");

            if (!tarjeta) return;

            const nombre = tarjeta.dataset.producto;

            const producto = PRODUCTOS[nombre];

            if (!producto) return;

            const agregado = await agregarAlCarrito({

                producto: nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                tipo: producto.tipo,
                diseño: "Sin diseño",
                color: "Original",
                talla: "M",
                ubicacion: "—",
                cantidad: 1

            });

            if (agregado) animarCarrito();

        });

    });

    document.querySelectorAll(
        ".personalizar-producto"
    ).forEach(boton => {

        boton.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            const tarjeta =
                boton.closest(".producto-card");

            if (!tarjeta) return;

            const nombre = tarjeta.dataset.producto;

            window.location.href =
                `diseños.html?producto=${encodeURIComponent(nombre)}`;

        });

    });

    document.querySelectorAll(
        ".favorito-btn"
    ).forEach(boton => {

        boton.addEventListener("click", () => {

            boton.classList.toggle("favorito");

            boton.textContent =
                boton.classList.contains("favorito")
                    ? "♥"
                    : "♡";

        });

    });

}


function inicializarBuscador() {

    const input =
        document.getElementById("busqueda-productos");

    if (!input) return;

    input.addEventListener(
        "input",
        aplicarFiltrosProductos
    );

}


function inicializarFiltros() {

    document.querySelectorAll(".filtro")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                document.querySelectorAll(".filtro")
                    .forEach(item =>
                        item.classList.remove("activo")
                    );

                boton.classList.add("activo");

                aplicarFiltrosProductos();

            });

        });

}


function aplicarFiltrosProductos() {

    const input =
        document.getElementById("busqueda-productos");

    const texto =
        input
            ? input.value.toLowerCase().trim()
            : "";

    const filtroActivo =
        document.querySelector(".filtro.activo");

    const categoria =
        filtroActivo
            ? filtroActivo.dataset.categoria
            : "todos";

    document.querySelectorAll(
        ".producto-card"
    ).forEach(tarjeta => {

        const nombre =
            (tarjeta.dataset.producto || "")
                .toLowerCase();

        const categoriaTarjeta =
            tarjeta.dataset.categoria || "";

        const coincideTexto =
            nombre.includes(texto);

        const coincideCategoria =
            categoria === "todos" ||
            categoriaTarjeta === categoria;

        tarjeta.classList.toggle(
            "oculto",
            !(coincideTexto && coincideCategoria)
        );

    });

    document.querySelectorAll(
        ".categoria-productos"
    ).forEach(seccion => {

        const categoriaSeccion =
            seccion.dataset.categoria;

        const coincideFiltro =
            categoria === "todos" ||
            categoriaSeccion === categoria;

        const tieneVisible =
            seccion.querySelector(
                ".producto-card:not(.oculto)"
            );

        seccion.classList.toggle(
            "oculta",
            !coincideFiltro || !tieneVisible
        );

    });

}


/* =========================================================
   PERSONALIZADOR
   ========================================================= */

function inicializarPersonalizador() {

    const previewPrenda =
        document.getElementById("preview-prenda");

    if (!previewPrenda) return;

    const parametros =
        new URLSearchParams(location.search);

    const productoURL =
        parametros.get("producto");

    if (
        productoURL &&
        PRODUCTOS[productoURL]
    ) {

        personalizacion.producto = productoURL;

    }


    /* PRENDAS */

    document.querySelectorAll(
        ".prenda-opcion"
    ).forEach(opcion => {

        opcion.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            const producto =
                opcion.dataset.producto;

            if (!PRODUCTOS[producto]) return;

            personalizacion.producto = producto;

            document.querySelectorAll(
                ".prenda-opcion"
            ).forEach(item => {

                item.classList.remove(
                    "activo",
                    "seleccionado"
                );

            });

            opcion.classList.add(
                "activo",
                "seleccionado"
            );

            actualizarPreviewPersonalizacion();

        });

    });


    /* DISEÑOS */

    document.querySelectorAll(
        ".opcion-diseno"
    ).forEach(opcion => {

        opcion.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            const diseño =
                opcion.dataset.diseno;

            if (!DISEÑOS.hasOwnProperty(diseño)) return;

            personalizacion.diseño = diseño;

            document.querySelectorAll(
                ".opcion-diseno"
            ).forEach(item => {

                item.classList.remove(
                    "activo",
                    "seleccionado"
                );

            });

            opcion.classList.add(
                "activo",
                "seleccionado"
            );

            actualizarPreviewPersonalizacion();

        });

    });


    /* COLORES */

    document.querySelectorAll(
        ".color-opcion"
    ).forEach(opcion => {

        opcion.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            personalizacion.color =
                opcion.dataset.color;

            document.querySelectorAll(
                ".color-opcion"
            ).forEach(item => {

                item.classList.remove(
                    "activo",
                    "seleccionado"
                );

            });

            opcion.classList.add(
                "activo",
                "seleccionado"
            );

            actualizarPreviewPersonalizacion();

        });

    });


    /* TALLAS */

    document.querySelectorAll(
        ".talla-opcion"
    ).forEach(opcion => {

        opcion.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            personalizacion.talla =
                opcion.dataset.talla;

            document.querySelectorAll(
                ".talla-opcion"
            ).forEach(item => {

                item.classList.remove(
                    "activo",
                    "seleccionado"
                );

            });

            opcion.classList.add(
                "activo",
                "seleccionado"
            );

            actualizarPreviewPersonalizacion();

        });

    });


    /* UBICACIÓN */

    document.querySelectorAll(
        ".ubicacion-opcion"
    ).forEach(opcion => {

        opcion.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            personalizacion.ubicacion =
                opcion.dataset.ubicacion;

            document.querySelectorAll(
                ".ubicacion-opcion"
            ).forEach(item => {

                item.classList.remove(
                    "activo",
                    "seleccionado"
                );

            });

            opcion.classList.add(
                "activo",
                "seleccionado"
            );

            actualizarPreviewPersonalizacion();

        });

    });


    /* CANTIDAD */

    const menos =
        document.getElementById(
            "personalizacion-menos"
        );

    const mas =
        document.getElementById(
            "personalizacion-mas"
        );

    const inputCantidad =
        document.getElementById(
            "personalizacion-cantidad"
        );


    if (menos) {

        menos.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            if (personalizacion.cantidad > 1) {

                personalizacion.cantidad--;

                actualizarPreviewPersonalizacion();

            }

        });

    }


    if (mas) {

        mas.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            if (personalizacion.cantidad < 20) {

                personalizacion.cantidad++;

                actualizarPreviewPersonalizacion();

            }

        });

    }


    if (inputCantidad) {

        inputCantidad.addEventListener(
            "change",
            async () => {

                if (!(await exigirSesion())) return;

                let valor =
                    parseInt(inputCantidad.value, 10);

                if (isNaN(valor)) {
                    valor = 1;
                }

                valor = Math.max(1, Math.min(20, valor));

                personalizacion.cantidad = valor;

                actualizarPreviewPersonalizacion();

            }
        );

    }


    seleccionarEstadoInicial();

    actualizarPreviewPersonalizacion();

}


/* =========================================================
   ESTADO INICIAL
   ========================================================= */

function seleccionarEstadoInicial() {

    const prenda =
        document.querySelector(
            `.prenda-opcion[data-producto="${personalizacion.producto}"]`
        );

    if (prenda) {

        document.querySelectorAll(
            ".prenda-opcion"
        ).forEach(item => {

            item.classList.remove(
                "activo",
                "seleccionado"
            );

        });

        prenda.classList.add(
            "activo",
            "seleccionado"
        );

    }


    const diseño =
        document.querySelector(
            `.opcion-diseno[data-diseno="${personalizacion.diseño}"]`
        );

    if (diseño) {

        document.querySelectorAll(
            ".opcion-diseno"
        ).forEach(item => {

            item.classList.remove(
                "activo",
                "seleccionado"
            );

        });

        diseño.classList.add(
            "activo",
            "seleccionado"
        );

    }


    const color =
        document.querySelector(
            `.color-opcion[data-color="${personalizacion.color}"]`
        );

    if (color) {

        document.querySelectorAll(
            ".color-opcion"
        ).forEach(item => {

            item.classList.remove(
                "activo",
                "seleccionado"
            );

        });

        color.classList.add(
            "activo",
            "seleccionado"
        );

    }


    const talla =
        document.querySelector(
            `.talla-opcion[data-talla="${personalizacion.talla}"]`
        );

    if (talla) {

        document.querySelectorAll(
            ".talla-opcion"
        ).forEach(item => {

            item.classList.remove(
                "activo",
                "seleccionado"
            );

        });

        talla.classList.add(
            "activo",
            "seleccionado"
        );

    }


    const ubicacion =
        document.querySelector(
            `.ubicacion-opcion[data-ubicacion="${personalizacion.ubicacion}"]`
        );

    if (ubicacion) {

        document.querySelectorAll(
            ".ubicacion-opcion"
        ).forEach(item => {

            item.classList.remove(
                "activo",
                "seleccionado"
            );

        });

        ubicacion.classList.add(
            "activo",
            "seleccionado"
        );

    }

}


/* =========================================================
   PREVIEW
   ========================================================= */

function actualizarPreviewPersonalizacion() {

    const producto =
        PRODUCTOS[personalizacion.producto];

    if (!producto) return;

    const previewPrenda =
        document.getElementById("preview-prenda");

    const previewDiseño =
        document.getElementById("preview-diseno");

    const cantidad =
        document.getElementById(
            "personalizacion-cantidad"
        );


    if (previewPrenda) {

        if (producto.imagen) {

            previewPrenda.src = producto.imagen;

            previewPrenda.alt =
                personalizacion.producto;

            previewPrenda.style.display = "block";

            previewPrenda.style.filter =
                COLORES[personalizacion.color] || "none";

        } else {

            previewPrenda.removeAttribute("src");

            previewPrenda.style.display = "none";

        }

    }


    if (previewDiseño) {

        const ruta =
            DISEÑOS[personalizacion.diseño];

        if (ruta) {

            previewDiseño.src = ruta;

            previewDiseño.alt =
                personalizacion.diseño;

            previewDiseño.style.display = "block";

        } else {

            previewDiseño.removeAttribute("src");

            previewDiseño.style.display = "none";

        }

    }


    actualizarUbicacionDiseño();


    if (cantidad) {

        cantidad.value = personalizacion.cantidad;

    }


    const resumenPrenda =
        document.getElementById("resumen-prenda");

    const resumenDiseño =
        document.getElementById("resumen-diseno");

    const resumenColor =
        document.getElementById("resumen-color");

    const resumenTalla =
        document.getElementById("resumen-talla");

    const resumenUbicacion =
        document.getElementById("resumen-ubicacion");

    const resumenPrecio =
        document.getElementById("resumen-precio");


    if (resumenPrenda) {
        resumenPrenda.textContent = personalizacion.producto;
    }

    if (resumenDiseño) {
        resumenDiseño.textContent = personalizacion.diseño;
    }

    if (resumenColor) {
        resumenColor.textContent = personalizacion.color;
    }

    if (resumenTalla) {
        resumenTalla.textContent = personalizacion.talla;
    }

    if (resumenUbicacion) {
        resumenUbicacion.textContent = personalizacion.ubicacion;
    }


    const total =
        producto.precio * personalizacion.cantidad;

    if (resumenPrecio) {
        resumenPrecio.textContent = formatearPrecio(total);
    }


    const colorActual =
        document.getElementById("color-actual");

    const tallaActual =
        document.getElementById("talla-actual");

    const ubicacionLabel =
        document.getElementById("ubicacion-label");


    if (colorActual) {
        colorActual.textContent = personalizacion.color;
    }

    if (tallaActual) {
        tallaActual.textContent = personalizacion.talla;
    }

    if (ubicacionLabel) {
        ubicacionLabel.textContent = personalizacion.ubicacion;
    }

    actualizarProgreso();

}


/* =========================================================
   UBICACIÓN DEL DISEÑO
   ========================================================= */

function actualizarUbicacionDiseño() {

    const layer =
        document.getElementById("preview-diseno-layer");

    const etiqueta =
        document.getElementById("ubicacion-actual");

    if (!layer) return;

    layer.classList.remove(
        "posicion-centro",
        "posicion-pecho",
        "posicion-abajo",
        "posicion-lateral",
        "posicion-espalda"
    );

    const mapa = {

        "Centro": "posicion-centro",
        "Pecho": "posicion-pecho",
        "Abajo": "posicion-abajo",
        "Lateral": "posicion-lateral",
        "Espalda": "posicion-espalda"

    };

    layer.classList.add(
        mapa[personalizacion.ubicacion] || "posicion-centro"
    );

    if (etiqueta) {
        etiqueta.textContent = personalizacion.ubicacion;
    }

}


/* =========================================================
   PROGRESO
   ========================================================= */

function actualizarProgreso() {

    const pasos =
        document.querySelectorAll(
            ".progreso-paso, .progreso-item"
        );

    if (!pasos.length) return;

    pasos.forEach((paso, index) => {

        paso.classList.remove("activo");

        if (index <= 2) {
            paso.classList.add("activo");
        }

    });

}


/* =========================================================
   AÑADIR PERSONALIZADO
   ========================================================= */

function inicializarBotonPersonalizado() {

    const boton =
        document.getElementById("agregar-personalizado");

    if (!boton) return;

    boton.addEventListener("click", async () => {

        if (!(await exigirSesion())) return;

        const producto =
            PRODUCTOS[personalizacion.producto];

        if (!producto) return;

        const agregado = await agregarAlCarrito({

            producto: personalizacion.producto,
            diseño: personalizacion.diseño,
            color: personalizacion.color,
            talla: personalizacion.talla,
            ubicacion: personalizacion.ubicacion,
            cantidad: personalizacion.cantidad,
            precio: producto.precio,
            imagen: producto.imagen

        });

        if (agregado) {

            animarCarrito();

            abrirCarrito();

        }

    });

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function inicializarCheckout() {

    const abrir =
        document.getElementById("abrir-checkout");

    const cerrar =
        document.getElementById("cerrar-checkout");

    const overlay =
        document.getElementById("checkout-overlay");

    const form =
        document.getElementById("checkout-form");


    if (abrir) {

        abrir.addEventListener("click", async () => {

            if (!(await exigirSesion())) return;

            if (!carrito.length) {

                mostrarNotificacion(
                    "Primero agrega algo al carrito ✦"
                );

                return;

            }

            if (overlay) {
                overlay.classList.add("activo");
            }

        });

    }


    if (cerrar) {

        cerrar.addEventListener("click", () => {

            if (overlay) {
                overlay.classList.remove("activo");
            }

        });

    }


    if (overlay) {

        overlay.addEventListener("click", evento => {

            if (evento.target === overlay) {
                overlay.classList.remove("activo");
            }

        });

    }


    if (form) {

        form.addEventListener("submit", async evento => {

            evento.preventDefault();

            if (!(await exigirSesion())) return;

            finalizarCompra();

        });

    }

}


function finalizarCompra() {

    if (!carrito.length) return;

    const overlay =
        document.getElementById("checkout-overlay");

    const form =
        document.getElementById("checkout-form");


    carrito = [];

    guardarCarrito();

    renderizarCarrito();


    if (overlay) {
        overlay.classList.remove("activo");
    }

    if (form) {
        form.reset();
    }

    cerrarCarrito();

    mostrarNotificacion(
        "¡Pedido recibido! Gracias por crear tu VOIDWEAR ✦"
    );

}


/* =========================================================
   ASISTENTE
   ========================================================= */

function inicializarAsistente() {

    const boton =
        document.getElementById("asistente-boton");

    const panel =
        document.getElementById("asistente-panel");

    const cerrar =
        document.getElementById("cerrar-asistente");

    const form =
        document.getElementById("asistente-form");

    const input =
        document.getElementById("asistente-input");

    if (!boton || !panel) return;

    boton.addEventListener("click", () => {

        panel.classList.toggle("activo");

        if (
            panel.classList.contains("activo") &&
            input
        ) {
            input.focus();
        }

    });


    if (cerrar) {

        cerrar.addEventListener("click", () => {
            panel.classList.remove("activo");
        });

    }


    if (form && input) {

        form.addEventListener("submit", evento => {

            evento.preventDefault();

            const texto = input.value.trim();

            if (!texto) return;

            agregarMensajeAsistente(texto, "usuario");

            input.value = "";

            setTimeout(() => {

                const respuesta =
                    responderAsistente(texto);

                agregarMensajeAsistente(
                    respuesta,
                    "asistente"
                );

            }, 450);

        });

    }

}


/* =========================================================
   MENSAJES DEL ASISTENTE
   ========================================================= */

function agregarMensajeAsistente(mensaje, tipo) {

    const contenedor =
        document.getElementById("asistente-mensajes");

    if (!contenedor) return;

    const elemento =
        document.createElement("div");

    elemento.className =
        tipo === "usuario"
            ? "mensaje-usuario"
            : "mensaje-asistente";

    if (tipo === "usuario") {

        elemento.innerHTML = `<p></p>`;

        elemento.querySelector("p").textContent = mensaje;

    } else {

        elemento.innerHTML = `
            <span>✦</span>
            <p></p>
        `;

        elemento.querySelector("p").textContent = mensaje;

    }

    contenedor.appendChild(elemento);

    contenedor.scrollTop = contenedor.scrollHeight;

}


/* =========================================================
   RESPUESTA DEL ASISTENTE
   ========================================================= */

function responderAsistente(mensaje) {

    const texto =
        mensaje.toLowerCase().trim();


    /* SALUDOS */

    if (
        texto.includes("hola") ||
        texto.includes("holi") ||
        texto.includes("holaa") ||
        texto.includes("hey")
    ) {

        return "Holaaa ♡ Cuéntame qué estás buscando. Puedes decirme la prenda, el color o simplemente la vibe que quieres y lo armamos juntas.";

    }


    /* AGRADECIMIENTO */

    if (
        texto.includes("gracias") ||
        texto.includes("thank")
    ) {

        return "Siempreee 💗 Ahora ve y crea algo muy tú ✦";

    }


    /* COMBINACIONES */

    const hoodie =
        texto.includes("hoodie") ||
        texto.includes("buzo") ||
        texto.includes("sudadera");

    const camiseta =
        texto.includes("camiseta") ||
        texto.includes("oversize") ||
        texto.includes("baby tee") ||
        texto.includes("crop");

    const cargo =
        texto.includes("cargo") ||
        texto.includes("pantalon") ||
        texto.includes("pantalón") ||
        texto.includes("parachute");


    const negro =
        texto.includes("negro") ||
        texto.includes("negra");

    const rosa =
        texto.includes("rosa") ||
        texto.includes("rosado") ||
        texto.includes("rosada") ||
        texto.includes("pink");

    const azul =
        texto.includes("azul") ||
        texto.includes("blue");

    const beige =
        texto.includes("beige") ||
        texto.includes("crema");

    const blanco =
        texto.includes("blanco") ||
        texto.includes("blanca");

    const verde =
        texto.includes("verde");


    const discreto =
        texto.includes("discreto") ||
        texto.includes("discreta") ||
        texto.includes("sutil") ||
        texto.includes("minimalista") ||
        texto.includes("minimal") ||
        texto.includes("simple");

    const llamativo =
        texto.includes("llamativo") ||
        texto.includes("llamativa") ||
        texto.includes("destacar") ||
        texto.includes("destaque") ||
        texto.includes("atrevido") ||
        texto.includes("atrevida");

    const femenino =
        texto.includes("femenino") ||
        texto.includes("femenina") ||
        texto.includes("girly") ||
        texto.includes("cute") ||
        texto.includes("tierno") ||
        texto.includes("tierna");

    const dark =
        texto.includes("dark") ||
        texto.includes("oscuro") ||
        texto.includes("oscura") ||
        texto.includes("edgy");

    const diario =
        texto.includes("diario") ||
        texto.includes("todos los días") ||
        texto.includes("todos los dias") ||
        texto.includes("combinar");


    /* HOODIE */

    if (hoodie && negro && femenino) {

        return "Ufff, hoodie negra + vibe femenina 💗. Yo probaría Cross Heart si quieres algo romántico con actitud, o Abstract Bloom si quieres algo más artístico. Pecho queda delicado y Centro más protagonista.";

    }

    if (hoodie && negro && discreto) {

        return "Entonces yo no la cargaría demasiado 🖤. Hoodie negra + Star Signal o Cross Heart en Pecho queda con personalidad, pero sigue siendo fácil de usar.";

    }

    if (hoodie && negro && llamativo) {

        return "AHHH, entonces vamos con toda 😭🖤. Hoodie negra + Night City o Flame Theory en Centro. Ahí sí el diseño se roba la atención.";

    }

    if (hoodie && dark) {

        return "Para una vibe dark 🖤, una hoodie negra es una base brutal. Yo miraría Night City, Cross Heart o Flame Theory. Centro si quieres que destaque; Pecho si quieres algo más controlado.";

    }

    if (hoodie && femenino) {

        return "Si quieres una hoodie femenina sin que se vuelva demasiado cute, probaría Rosa o Beige con Abstract Bloom o Cross Heart 💗. Sigue teniendo esa mezcla de girly + streetwear.";

    }

    if (hoodie) {

        return "Para una Hoodie yo pensaría primero en qué tan protagonista quieres que sea ✦ Centro hace que el diseño destaque muchísimo; Pecho se siente más clean.";

    }


    /* CAMISETA */

    if (camiseta && diario) {

        return "Para diario me iría por una Oversize Essential o Oversize Basic. Negro, Beige o Blanco son fáciles de combinar y Star Signal en Pecho le da ese detalle sin recargarla ✦.";

    }

    if (camiseta && femenino) {

        return "Para algo femenino, Baby Tee o Crop Oversize pueden quedar muy lindas 💗. Si quieres diseño, Abstract Bloom o Butterfly Code tienen una vibra más delicada.";

    }

    if (camiseta) {

        return "Las Oversize son una base súper versátil ✦. Puedes hacer Centro para algo protagonista, Pecho para algo discreto o Lateral si quieres salirte de lo típico.";

    }


    /* CARGO */

    if (cargo) {

        return "Los Cargo tienen toda la vibra streetwear 😮‍💨. Cargo Wide si quieres una silueta más relajada, Cargo Classic si quieres algo equilibrado y Parachute Pants si buscas algo más llamativo.";

    }


    /* FEMENINO + ROSA */

    if (femenino && rosa) {

        return "Rosa + femenino 💗. Yo miraría Abstract Bloom o Butterfly Code si quieres algo delicado, y Cross Heart si quieres que tenga un poquito más de actitud.";

    }


    /* FEMENINO + NEGRO */

    if (femenino && negro) {

        return "Negro + femenino queda demasiado interesante 🖤. Cross Heart tiene ese toque romántico, mientras que Abstract Bloom se siente más artístico.";

    }


    /* DARK */

    if (dark && negro) {

        return "Negro + dark 🖤. Night City, Cross Heart o Flame Theory van por caminos distintos, pero los tres pueden funcionar. Yo elegiría según cuánto quieras que destaque.";

    }


    /* CLEAN */

    if (
        texto.includes("clean") ||
        texto.includes("minimal")
    ) {

        return "Si quieres algo clean, mantendría la base Negra, Blanca o Beige y usaría Star Signal o Cross Heart en Pecho. Sencillo, pero con personalidad.";

    }


    /* LLAMATIVO */

    if (llamativo) {

        return "Entonces no escondamos el diseño 😭✨. Night City o Flame Theory en Centro tienen bastante presencia. Si quieres algo llamativo pero más artístico, Abstract Bloom.";

    }


    /* DISCRETO */

    if (discreto) {

        return "Para algo discreto, yo usaría Pecho o Lateral. Star Signal y Cross Heart funcionan muy bien porque tienen personalidad sin llenar toda la prenda ✦.";

    }


    /* COLORES */

    if (rosa) {

        return "El rosa da una vibe más suave y femenina 💗. Abstract Bloom y Butterfly Code serían mis primeras opciones; Cross Heart si quieres algo con más actitud.";

    }

    if (negro) {

        return "El negro es súper versátil 🖤. Star Signal si quieres algo clean, Cross Heart si quieres personalidad y Night City o Flame Theory si quieres que se note.";

    }

    if (azul) {

        return "El azul le da una vibra fría y urbana 💙. Night City o Star Signal pueden quedar muy bien si quieres seguir por ese camino.";

    }

    if (beige) {

        return "Beige es una base muy limpia 🤎. Puedes combinarlo con Abstract Bloom para algo artístico o Cross Heart para darle un poco más de personalidad.";

    }

    if (blanco) {

        return "El blanco deja que prácticamente cualquier diseño sea protagonista 🤍. Night City para algo urbano o Abstract Bloom para algo más artístico.";

    }

    if (verde) {

        return "El verde puede quedar muy cool si quieres salir de los colores típicos 💚. Yo usaría un diseño con bastante contraste para que no se pierda.";

    }


    /* DISEÑOS */

    if (texto.includes("night city")) {

        return "Night City 🌃 tiene una vibra urbana muy marcada. Centro si quieres que sea protagonista; Pecho si quieres bajarle un poquito la intensidad.";

    }

    if (texto.includes("cross heart")) {

        return "Cross Heart ♡ tiene ese equilibrio entre romántico y alternativo. Me gusta especialmente para una vibe femenina o ligeramente dark.";

    }

    if (texto.includes("smile fade")) {

        return "Smile Fade tiene una vibra relajada y curiosita ✦. Es buena opción si quieres algo juvenil sin que la prenda se vea demasiado cargada.";

    }

    if (texto.includes("abstract bloom")) {

        return "Abstract Bloom 🌸 se siente más artístico y delicado. Es de los que elegiría si quieres que tu prenda tenga un detalle diferente.";

    }

    if (texto.includes("star signal")) {

        return "Star Signal ✦ es bastante versátil. Si quieres algo que puedas usar seguido sin pensar demasiado con qué combinarlo, me gusta muchísimo.";

    }

    if (texto.includes("flame theory")) {

        return "Flame Theory 🔥 tiene bastante actitud. Centro si quieres que destaque, Pecho si quieres mantenerlo un poco más equilibrado.";

    }

    if (texto.includes("butterfly")) {

        return "Butterfly Code 🦋 tiene una vibra más cute y delicada. Rosa o Beige lo hacen más girly; Negro lo lleva hacia algo más alternativo.";

    }

    if (
        texto.includes("broken heart") ||
        texto.includes("corazón roto") ||
        texto.includes("corazon roto")
    ) {

        return "Broken Heart 💔 tiene una vibra más emocional y alternativa. Negro lo hace más dark y Rosa lo vuelve mucho más suave.";

    }


    /* URBANO */

    if (
        texto.includes("urbano") ||
        texto.includes("street") ||
        texto.includes("streetwear") ||
        texto.includes("outfit")
    ) {

        return "Para una vibra urbana 😮‍💨 yo mezclaría una Oversize o Hoodie con Cargo Wide. Para diseño, Night City, Flame Theory o Cross Heart quedan muy VOIDWEAR.";

    }


    /* COMODIDAD */

    if (
        texto.includes("comodo") ||
        texto.includes("comoda") ||
        texto.includes("comodidad") ||
        texto.includes("relajado") ||
        texto.includes("relajada") ||
        texto.includes("holgado") ||
        texto.includes("holgada")
    ) {

        return "Si buscas comodidad sin perder el estilo, una Oversize con Cargo Classic o Parachute Pants es una combinación muy VOIDWEAR 🤍.";

    }


    /* PRECIOS */

    if (
        texto.includes("precio") ||
        texto.includes("precios") ||
        texto.includes("cuesta") ||
        texto.includes("cuánto") ||
        texto.includes("cuanto")
    ) {

        return "Depende de la prenda 💗. Las camisetas van desde $30.000, las Hoodies desde $75.000 y los Cargos desde $70.000. Si me dices cuál te gusta, te digo el precio exacto.";

    }


    /* TALLAS */

    if (
        texto.includes("talla") ||
        texto.includes("tamaño")
    ) {

        return "Puedes elegir XS, S, M, L o XL ✦. Si buscas una caída más relajada, normalmente una talla mayor da una silueta más oversized.";

    }


    /* UBICACIÓN */

    if (
        texto.includes("pecho") ||
        texto.includes("centro") ||
        texto.includes("lateral") ||
        texto.includes("espalda") ||
        texto.includes("abajo")
    ) {

        return "La ubicación cambia bastante la vibra ✦ Centro = protagonista, Pecho = discreto, Lateral = diferente, Abajo = más relajado y Espalda = statement.";

    }


    /* AYUDA */

    if (
        texto.includes("ayuda") ||
        texto.includes("recomiend") ||
        texto.includes("elegir") ||
        texto.includes("escojo") ||
        texto.includes("no sé") ||
        texto.includes("no se") ||
        texto.includes("quiero algo")
    ) {

        return "SÍÍ, te ayudo 😭💗. Dime aunque sea una cosa: qué prenda quieres, qué color te gusta o si buscas algo discreto o llamativo. Yo conecto el resto.";

    }


    /* RESPUESTA GENERAL */

    const respuestasGenerales = [

        "Mmm, cuéntame un poquito más 👀. ¿Qué prenda tienes en mente o qué vibe quieres conseguir?",

        "Okayyy, vamos a descifrarlo 😭💗. ¿Quieres algo urbano, femenino, dark, clean o que destaque muchísimo?",

        "Tengo varias ideas ✦ Dime un color, una prenda o incluso una palabra que describa tu estilo y empezamos desde ahí.",

        "Eso puede quedar muy cool 👀. Dame un poquito más de contexto y te ayudo a armar la combinación.",

        "VOIDWEAR mode activado 🛍️✨. Cuéntame qué tienes en mente y vemos qué diseño, prenda y ubicación combinan mejor."

    ];

    return respuestasGenerales[
        Math.floor(Math.random() * respuestasGenerales.length)
    ];

}


/* =========================================================
   TECLA ESC
   ========================================================= */

function inicializarEscape() {

    document.addEventListener("keydown", evento => {

        if (evento.key !== "Escape") return;

        cerrarCarrito();

        const checkout =
            document.getElementById("checkout-overlay");

        if (checkout) {
            checkout.classList.remove("activo");
        }

        const asistente =
            document.getElementById("asistente-panel");

        if (asistente) {
            asistente.classList.remove("activo");
        }

    });

}


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    inicializarMenu();

    marcarNavActivo();

    inicializarCarrito();

    inicializarProductos();

    inicializarBuscador();

    inicializarFiltros();

    inicializarPersonalizador();

    inicializarBotonPersonalizado();

    inicializarCheckout();

    inicializarAsistente();

    inicializarEscape();

});
