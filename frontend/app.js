// ======================================================
// GIFFLOWER - COTIZADOR
// ======================================================

let ultimaCotizacion = null;
let floresDisponibles = [];

// ======================================================
// ELEMENTOS PRINCIPALES
// ======================================================

const formulario = document.getElementById('cotizador-form');
const paquetesContainer = document.getElementById('paquetes-container');
const btnAgregarPaquete = document.getElementById('btn-add-paquete');
const resultCard = document.getElementById('result-card');

// Modales del catálogo
const catalogoModal = document.getElementById('catalogo-modal');
const editarFlorModal = document.getElementById('editar-flor-modal');
const nuevaFlorModal = document.getElementById('nueva-flor-modal');

const catalogoBody = document.getElementById('catalogo-body');
const catalogoCargando = document.getElementById('catalogo-cargando');


// ======================================================
// FLORES DEL COTIZADOR
// ======================================================

async function cargarFlores() {
    try {
        const response = await fetch('http://localhost:3000/flores');

        if (!response.ok) {
            throw new Error('No se pudieron obtener las flores');
        }

        floresDisponibles = await response.json();

        console.log(
            'Flores cargadas desde MongoDB:',
            floresDisponibles
        );

        crearFilaPaquete();

    } catch (error) {
        console.error(
            'Error al cargar las flores:',
            error
        );

        alert(
            'No se pudieron cargar las flores registradas en MongoDB.'
        );
    }
}


function llenarSelectFlores(select) {
    select.innerHTML =
        '<option value="">Selecciona una flor</option>';

    const floresActivas = floresDisponibles.filter(
        flor => flor.activo !== false
    );

    floresActivas.forEach((flor) => {
        const option = document.createElement('option');

        option.value = flor.nombre;
        option.textContent = flor.nombre;

        // Nombres reales de los campos en MongoDB
        option.dataset.precioCompra = flor.precio;
        option.dataset.precioLista = flor.precioLista;

        select.appendChild(option);
    });
}


function configurarPrecioFlor(select) {
    select.addEventListener('change', () => {
        const fila = select.closest('.paquete-item');

        const campoPrecioCompra = fila.querySelector(
            '.paquete-precio-compra'
        );

        const campoPrecioLista = fila.querySelector(
            '.paquete-precio-lista'
        );

        if (select.value === '') {
            campoPrecioCompra.value = '';
            campoPrecioLista.value = '';
            return;
        }

        const opcionSeleccionada =
            select.options[select.selectedIndex];

        campoPrecioCompra.value =
            opcionSeleccionada.dataset.precioCompra;

        campoPrecioLista.value =
            opcionSeleccionada.dataset.precioLista;
    });
}


function crearFilaPaquete() {
    const fila = document.createElement('div');

    fila.className = 'paquete-item form-row';

    fila.innerHTML = `
        <div class="form-group">
            <label>Flor</label>

            <select class="paquete-nombre" required>
                <option value="">Selecciona una flor</option>
            </select>
        </div>

        <div class="form-group">
            <label>Cantidad</label>

            <input
                type="number"
                class="paquete-cantidad"
                placeholder="Ej: 2"
                min="1"
                step="1"
                required
            >
        </div>

        <div class="form-group">
            <label>Precio de compra C/U ($)</label>

            <input
                type="number"
                class="paquete-precio-compra"
                placeholder="Automático"
                min="0"
                step="0.01"
                readonly
                required
            >
        </div>

        <div class="form-group">
            <label>Precio de lista C/U ($)</label>

            <input
                type="number"
                class="paquete-precio-lista"
                placeholder="Automático"
                min="0"
                step="0.01"
                readonly
                required
            >
        </div>

        <div class="paquete-actions">
            <button
                type="button"
                class="btn-eliminar-paquete"
                title="Eliminar esta flor"
            >
                ✕
            </button>
        </div>
    `;

    paquetesContainer.appendChild(fila);

    const select = fila.querySelector('.paquete-nombre');

    llenarSelectFlores(select);
    configurarPrecioFlor(select);
    actualizarBotonesEliminar();
}


function actualizarBotonesEliminar() {
    const filas = document.querySelectorAll('.paquete-item');

    filas.forEach((fila) => {
        const boton = fila.querySelector(
            '.btn-eliminar-paquete'
        );

        boton.disabled = filas.length === 1;
    });
}


btnAgregarPaquete.addEventListener('click', () => {
    crearFilaPaquete();
});


paquetesContainer.addEventListener('click', (event) => {
    const boton = event.target.closest(
        '.btn-eliminar-paquete'
    );

    if (!boton) {
        return;
    }

    const filas = document.querySelectorAll('.paquete-item');

    if (filas.length <= 1) {
        return;
    }

    boton.closest('.paquete-item').remove();
    actualizarBotonesEliminar();
});


// ======================================================
// CALCULAR COTIZACIÓN
// ======================================================

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const filas = document.querySelectorAll('.paquete-item');

    const paquetes = Array.from(filas).map((fila) => ({
        nombre: fila
            .querySelector('.paquete-nombre')
            .value,

        cantidad: Number(
            fila
                .querySelector('.paquete-cantidad')
                .value
        ),

        precioCompra: Number(
            fila
                .querySelector('.paquete-precio-compra')
                .value
        ),

        precioLista: Number(
            fila
                .querySelector('.paquete-precio-lista')
                .value
        )
    }));

    const payload = {
        descuento:
            Number(
                document.getElementById('descuento').value
            ) || 0,

        paquetes
    };

    console.log(
        'PAYLOAD ENVIADO:',
        payload
    );

    try {
        const response = await fetch(
            'http://localhost:3000/cotizacion',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            const errorTexto = await response.text();

            console.error(
                'ERROR DEL BACKEND:',
                errorTexto
            );

            alert(
                'El servidor devolvió un error. Abre F12 → Consola para verlo.'
            );

            return;
        }

        const data = await response.json();

        console.log(
            'RESPUESTA DEL BACKEND:',
            data
        );

        ultimaCotizacion = payload;

        document.getElementById('res-costo').textContent =
            `$${Number(data.costoTotal).toFixed(2)}`;

        document.getElementById('res-venta-bruta').textContent =
            `$${Number(data.ventaBruta).toFixed(2)}`;

        document.getElementById('res-descuento').textContent =
            `-$${Number(data.descuento).toFixed(2)}`;

        document.getElementById('res-venta-final').textContent =
            `$${Number(data.ventaFinal).toFixed(2)}`;

        document.getElementById('res-flete').textContent =
            `-$${Number(data.flete).toFixed(2)}`;

        document.getElementById('res-utilidad').textContent =
            `$${Number(data.utilidadTotal).toFixed(2)}`;

        resultCard.classList.remove('hidden');

        resultCard.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    } catch (error) {
        console.error(
            'ERROR DE CONEXIÓN:',
            error
        );

        alert(
            'No se pudo conectar con el backend.'
        );
    }
});


// ======================================================
// DESCARGAR EXCEL
// ======================================================

document
    .getElementById('btn-descargar-excel')
    .addEventListener('click', async () => {

        if (!ultimaCotizacion) {
            alert(
                'Primero debes calcular una cotización.'
            );
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:3000/cotizacion/excel',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(
                        ultimaCotizacion
                    )
                }
            );

            if (!response.ok) {
                const errorTexto = await response.text();

                console.error(
                    'ERROR AL GENERAR EXCEL:',
                    errorTexto
                );

                throw new Error(
                    'No se pudo generar el Excel'
                );
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const enlace = document.createElement('a');

            enlace.href = url;
            enlace.download = 'cotizacion.xlsx';

            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);

            alert(
                'Hubo un problema al descargar el Excel.'
            );
        }
    });


// ======================================================
// NUEVA COTIZACIÓN
// ======================================================

document
    .getElementById('btn-nueva-cotizacion')
    .addEventListener('click', () => {

        formulario.reset();

        document.getElementById('descuento').value = 0;

        paquetesContainer.innerHTML = '';

        crearFilaPaquete();

        resultCard.classList.add('hidden');

        ultimaCotizacion = null;

        document
            .getElementById('form-card')
            .scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
    });


// ======================================================
// CATÁLOGO DE FLORES
// ======================================================

document
    .getElementById('btn-abrir-catalogo')
    .addEventListener('click', async () => {

        catalogoModal.classList.remove('hidden');
        await cargarCatalogoFlores();
    });


function cerrarCatalogo() {
    catalogoModal.classList.add('hidden');
}


document
    .getElementById('btn-cerrar-catalogo')
    .addEventListener('click', cerrarCatalogo);


document
    .getElementById('catalogo-overlay')
    .addEventListener('click', cerrarCatalogo);


async function cargarCatalogoFlores() {
    try {
        catalogoCargando.classList.remove('hidden');
        catalogoBody.innerHTML = '';

        const response = await fetch(
            'http://localhost:3000/flores/catalogo'
        );

        if (!response.ok) {
            throw new Error(
                'No se pudo cargar el catálogo'
            );
        }

        const flores = await response.json();

        if (flores.length === 0) {
            catalogoBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay flores registradas.
                    </td>
                </tr>
            `;
            return;
        }

        flores.forEach((flor) => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td class="catalogo-nombre">
                    ${flor.nombre}
                </td>

                <td class="catalogo-precio">
                    $${Number(flor.precio).toFixed(2)}
                </td>

                <td class="catalogo-precio">
                    $${Number(flor.precioLista).toFixed(2)}
                </td>

                <td>
                    <span class="${
                        flor.activo
                            ? 'estado-activo'
                            : 'estado-inactivo'
                    }">
                        ${
                            flor.activo
                                ? '● Activa'
                                : '● Inactiva'
                        }
                    </span>
                </td>

                <td>
                    <div class="catalogo-acciones">

                        <button
                            type="button"
                            class="btn-editar-flor"
                            data-id="${flor._id}"
                            data-nombre="${flor.nombre}"
                            data-precio="${flor.precio}"
                            data-precio-lista="${flor.precioLista}"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="${
                                flor.activo
                                    ? 'btn-desactivar-flor'
                                    : 'btn-reactivar-flor'
                            }"
                            data-id="${flor._id}"
                            data-activo="${flor.activo}"
                        >
                            ${
                                flor.activo
                                    ? 'Desactivar'
                                    : 'Reactivar'
                            }
                        </button>

                    </div>
                </td>
            `;

            catalogoBody.appendChild(fila);
        });

    } catch (error) {
        console.error(
            'Error catálogo:',
            error
        );

        catalogoBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No se pudo cargar el catálogo.
                </td>
            </tr>
        `;

    } finally {
        catalogoCargando.classList.add('hidden');
    }
}


// ======================================================
// EDITAR / ACTIVAR / DESACTIVAR FLOR
// ======================================================

catalogoBody.addEventListener('click', async (event) => {
    const botonEditar = event.target.closest(
        '.btn-editar-flor'
    );

    if (botonEditar) {
        document.getElementById('editar-flor-id').value =
            botonEditar.dataset.id;

        document.getElementById('editar-flor-nombre').textContent =
            botonEditar.dataset.nombre;

        document.getElementById('editar-precio').value =
            botonEditar.dataset.precio;

        document.getElementById('editar-precio-lista').value =
            botonEditar.dataset.precioLista;

        editarFlorModal.classList.remove('hidden');
        return;
    }

    const botonEstado = event.target.closest(
        '.btn-desactivar-flor, .btn-reactivar-flor'
    );

    if (!botonEstado) {
        return;
    }

    const id = botonEstado.dataset.id;

    const actualmenteActivo =
        botonEstado.dataset.activo === 'true';

    const nuevoEstado = !actualmenteActivo;

    const mensaje = nuevoEstado
        ? '¿Quieres reactivar esta flor?'
        : '¿Quieres desactivar esta flor? Ya no aparecerá en las cotizaciones.';

    if (!confirm(mensaje)) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/flores/${id}/estado`,
            {
                method: 'PATCH',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    activo: nuevoEstado
                })
            }
        );

        if (!response.ok) {
            const errorTexto = await response.text();

            console.error(
                'Error al cambiar estado:',
                errorTexto
            );

            throw new Error(
                'No se pudo cambiar el estado'
            );
        }

        await cargarCatalogoFlores();
        await refrescarFloresCotizador();

    } catch (error) {
        console.error(error);

        alert(
            'No se pudo cambiar el estado de la flor.'
        );
    }
});


// ======================================================
// MODAL EDITAR FLOR
// ======================================================

function cerrarEditarFlor() {
    editarFlorModal.classList.add('hidden');
}


document
    .getElementById('btn-cerrar-editar')
    .addEventListener('click', cerrarEditarFlor);


document
    .getElementById('btn-cancelar-editar')
    .addEventListener('click', cerrarEditarFlor);


document
    .getElementById('editar-overlay')
    .addEventListener('click', cerrarEditarFlor);


document
    .getElementById('editar-flor-form')
    .addEventListener('submit', async (event) => {

        event.preventDefault();

        const id =
            document.getElementById('editar-flor-id').value;

        const precio =
            Number(
                document.getElementById('editar-precio').value
            );

        const precioLista =
            Number(
                document
                    .getElementById('editar-precio-lista')
                    .value
            );

        if (precio < 0 || precioLista < 0) {
            alert(
                'Los precios no pueden ser negativos.'
            );
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/flores/${id}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        precio,
                        precioLista
                    })
                }
            );

            if (!response.ok) {
                const errorTexto = await response.text();

                console.error(
                    'Error al editar flor:',
                    errorTexto
                );

                throw new Error(
                    'No se pudieron actualizar los precios'
                );
            }

            cerrarEditarFlor();

            await cargarCatalogoFlores();
            await refrescarFloresCotizador();

            alert(
                '🌸 Precios actualizados correctamente.'
            );

        } catch (error) {
            console.error(error);

            alert(
                'No se pudieron guardar los cambios.'
            );
        }
    });


// ======================================================
// MODAL NUEVA FLOR
// ======================================================

document
    .getElementById('btn-nueva-flor')
    .addEventListener('click', () => {

        document
            .getElementById('nueva-flor-form')
            .reset();

        nuevaFlorModal.classList.remove('hidden');
    });


function cerrarNuevaFlor() {
    nuevaFlorModal.classList.add('hidden');
}


document
    .getElementById('btn-cerrar-nueva-flor')
    .addEventListener('click', cerrarNuevaFlor);


document
    .getElementById('btn-cancelar-nueva-flor')
    .addEventListener('click', cerrarNuevaFlor);


document
    .getElementById('nueva-flor-overlay')
    .addEventListener('click', cerrarNuevaFlor);


document
    .getElementById('nueva-flor-form')
    .addEventListener('submit', async (event) => {

        event.preventDefault();

        const nombre =
            document
                .getElementById('nueva-flor-nombre')
                .value
                .trim();

        const precio =
            Number(
                document.getElementById('nueva-flor-precio').value
            );

        const precioLista =
            Number(
                document
                    .getElementById('nueva-flor-precio-lista')
                    .value
            );

        if (!nombre) {
            alert(
                'Escribe el nombre de la flor.'
            );
            return;
        }

        if (precio < 0 || precioLista < 0) {
            alert(
                'Los precios no pueden ser negativos.'
            );
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:3000/flores',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        nombre,
                        precio,
                        precioLista
                    })
                }
            );

            if (!response.ok) {
                const errorTexto = await response.text();

                console.error(
                    'Error al registrar flor:',
                    errorTexto
                );

                throw new Error(
                    'No se pudo registrar la flor'
                );
            }

            cerrarNuevaFlor();

            await cargarCatalogoFlores();
            await refrescarFloresCotizador();

            alert(
                '🌸 Flor agregada correctamente.'
            );

        } catch (error) {
            console.error(error);

            alert(
                'No se pudo agregar la flor. Verifica que el nombre no esté registrado previamente.'
            );
        }
    });


// ======================================================
// REFRESCAR SELECTS DEL COTIZADOR
// ======================================================

async function refrescarFloresCotizador() {
    try {
        const response = await fetch(
            'http://localhost:3000/flores'
        );

        if (!response.ok) {
            throw new Error(
                'No se pudieron refrescar las flores'
            );
        }

        floresDisponibles = await response.json();

        document
            .querySelectorAll('.paquete-nombre')
            .forEach((select) => {

                const valorActual = select.value;

                llenarSelectFlores(select);

                const existe = Array
                    .from(select.options)
                    .some(
                        option =>
                            option.value === valorActual
                    );

                if (valorActual && existe) {
                    select.value = valorActual;

                    select.dispatchEvent(
                        new Event('change')
                    );

                } else {
                    /*
                     * Si la flor fue desactivada,
                     * limpiamos también los precios
                     * de la fila para no dejar datos viejos.
                     */
                    select.value = '';

                    const fila =
                        select.closest('.paquete-item');

                    fila.querySelector(
                        '.paquete-precio-compra'
                    ).value = '';

                    fila.querySelector(
                        '.paquete-precio-lista'
                    ).value = '';
                }
            });

    } catch (error) {
        console.error(
            'Error refrescando flores:',
            error
        );
    }
}


// ======================================================
// CERRAR MODALES CON ESC
// ======================================================

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
        return;
    }

    cerrarNuevaFlor();
    cerrarEditarFlor();
    cerrarCatalogo();
});


// ======================================================
// INICIAR APLICACIÓN
// ======================================================

cargarFlores();
