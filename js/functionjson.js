var productos = [];
var productosNuevo = [];
let codigo = "";

//  función para cargar productos desde un archivo JSON
function cargarProductos(jsonFile) {
    productos = [];
    productosNuevo = [];

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            productos = data.map(producto => ({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen
            }));

            //  objetos a arreglos 
            for (let i = 0; i < productos.length; i++) {
                let partesId = productos[i].id;
                let partesNombre = productos[i].nombre;
                let partesPrecio = productos[i].precio;
                let partesImg = productos[i].imagen;

                productosNuevo.push([partesId, partesNombre, partesPrecio, partesImg]);
            }
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// cambio de idioma
function toggleIdioma() {
    const toggleSwitch = document.querySelector('#toggle-idioma input');
    var tituloCodigoBarras = document.getElementById("titulo-CodigoBarras");

    if (toggleSwitch.checked) {
        cargarProductos(`./data/productosIngles.json`);
        tituloCodigoBarras.textContent = "Code Bar";
        localStorage.setItem('toggleState', 'checked');
    } else {
        cargarProductos(`./data/productos.json`);
        tituloCodigoBarras.textContent = "Codigo de Barras";
        localStorage.setItem('toggleState', 'unchecked');
    }
}

// cambio de modo
function toggleDarkMode() {
    const toggleSwitch = document.querySelector('#toggle-mode input');

    if (toggleSwitch.checked) {
        document.body.classList.add("darkmode");
        localStorage.setItem('darkmode', 'activo');
    } else {
        document.body.classList.remove("darkmode");
        localStorage.setItem('darkmode', null);
    }
}

// config
window.addEventListener('load', function () {
    const toggleSwitchIdioma = document.querySelector('#toggle-idioma input');
    const savedState = localStorage.getItem('toggleState');

    const toggleSwitchMode = document.querySelector('#toggle-mode input');
    const savedStateMode = localStorage.getItem("darkmode");

    var tituloCodigoBarras = document.getElementById("titulo-CodigoBarras");

    if (savedState === 'checked') {
        toggleSwitchIdioma.checked = true;
        cargarProductos(`./data/productosIngles.json`);
        tituloCodigoBarras.textContent = "Code Bar";
    } else {
        toggleSwitchIdioma.checked = false;
        cargarProductos(`./data/productos.json`);
        tituloCodigoBarras.textContent = "Codigo de Barras";
    }

    if (savedStateMode === 'activo') {
        toggleSwitchMode.checked = true;
        document.body.classList.add("darkmode");
    } else {
        toggleSwitchMode.checked = false;
        document.body.classList.remove("darkmode");
    }
});

// entrada en consola
document.addEventListener("keydown", (event) => {
    if (event.key != "Enter") {
        codigo += event.key;
    } else {
        console.log("Código ingresado:", codigo);
        buscar(codigo);
        codigo = "";
    }
});

// busqueda de producto por código
function buscar(codigo) {
    codigo = parseInt(codigo);
    var control = false;
    var salida = "";
    var tituloProducto = "Producto";
    var tituloPrecio = "Precio";
    var tituloNoEncontrado = "El producto no se encuentra en stock por el momento";

    // cambio de idioma
    var toggleState = localStorage.getItem('toggleState');
    if (toggleState === 'checked') {
        tituloProducto = "Product";
        tituloPrecio = "Price";
        tituloNoEncontrado = "Product not found in stock";
    }

    for (let i = 0; i < productosNuevo.length; i++) {
        if (productosNuevo[i][0] == codigo) {
            salida += `${tituloProducto}: ${productosNuevo[i][1]} <br>
            ${tituloPrecio}: ${productosNuevo[i][2]} <br>
            <img src="./img/${productosNuevo[i][3]}" width=auto height=auto >`;

            document.getElementById("respuesta").innerHTML = salida;
            control = true;
            break;
        }
    }

    if (!control) {
        document.getElementById("respuesta").innerHTML = `${tituloNoEncontrado}`;
    }

    // reinicio despues de 3segs
    setTimeout(function () {
        window.location.href = "index.html";
    }, 3000);
}

// fecha y hora actualizada
window.onload = function () {
    function actualizarFechaHora() {
        var tituloFecha = "Fecha";
        var tituloHora = "Hora";
        var idiomaFecha = "es-ES";

        // cambio de idioma si esta activado
        var toggleState = localStorage.getItem('toggleState');
        if (toggleState === 'checked') {
            tituloFecha = "Date";
            tituloHora = "Time";
            idiomaFecha = "en-EN";
        }

        const fecha = new Date();
        const opcionesFecha = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const opcionesHora = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        };

        const fechaFormateada = fecha.toLocaleDateString(idiomaFecha, opcionesFecha);
        const horaFormateada = fecha.toLocaleTimeString(idiomaFecha, opcionesHora);

        document.getElementById('fecha-hora').textContent =
            `${tituloFecha} ${fechaFormateada} - ${tituloHora} ${horaFormateada}`;
    }

    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000); // actuali cada segundo
};
