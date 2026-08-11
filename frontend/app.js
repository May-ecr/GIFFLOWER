let ultimaCotizacion = null;

//guardar las flores cargadas desde la base de datos 
let floresDisponibles = [];

async function cargarFlores() {
    try {
        const response = await fetch('http://localhost:3000/flores');

        if (!response.ok) {
            throw new Error('No se pudieron obtener las flores');
        }

        floresDisponibles = await response.json();

        document.querySelectorAll('.flor-nombre').forEach(select => {
            llenarSelectFlores(select);
            configurarPrecioFlor(select);
        });

    } catch (error) {
        console.error('Error al cargar las flores:', error);
    }
}

function llenarSelectFlores(select) {
    select.innerHTML = '<option value="">Selecciona una flor</option>';

    floresDisponibles.forEach(flor => {
        const option = document.createElement('option');

        option.value = flor.nombre;
        option.textContent = flor.nombre;
        option.dataset.costo = flor.costoUnitario;

        select.appendChild(option);
    });
}

function configurarPrecioFlor(select) {
    select.addEventListener('change', () => {
        const fila = select.closest('.flor-item');
        const campoCosto = fila.querySelector('.flor-costo');

        if (select.value === '') {
            campoCosto.value = '';
            return;
        }

        const opcionSeleccionada =
            select.options[select.selectedIndex];

        campoCosto.value =
            opcionSeleccionada.dataset.costo;
    });
}

// Agregar dinámicamente campos para más flores
document.getElementById('btn-add-flor').addEventListener('click', () => {
    const container = document.getElementById('flores-container');
    const newRow = document.createElement('div');
    newRow.className = 'flor-item form-row';
    newRow.innerHTML = `
    <select class="flor-nombre" required>
        <option value="">Selecciona una flor</option>
    </select>

    <input
        type="number"
        class="flor-cantidad"
        placeholder="Cantidad"
        min="1"
        required
    >

    <input
        type="number"
        class="flor-costo"
        placeholder="Precio C/U ($)"
        min="0"
        step="0.01"
        required
    >
`;
    container.appendChild(newRow);

    const nuevoSelect = newRow.querySelector('.flor-nombre');

    llenarSelectFlores(nuevoSelect);

    configurarPrecioFlor(nuevoSelect);
});



// Enviar formulario a tu API Express
document.getElementById('cotizador-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Obtener todas las flores ingresadas
    const floresElements = document.querySelectorAll('.flor-item');
    const flores = Array.from(floresElements).map(row => ({
        nombre: row.querySelector('.flor-nombre').value,
        cantidad: Number(row.querySelector('.flor-cantidad').value),
        costoUnitario: Number(row.querySelector('.flor-costo').value)
    }));

    // 2. Armar el JSON exactamente como lo probamos en Postman
    const payload = {
        descuento: Number(document.getElementById('descuento').value),
        paquetes: [
            {
                nombre: document.getElementById('paqueteNombre').value,
                precioVenta: Number(document.getElementById('precioVenta').value),
                flores: flores
            }
        ]
    };

    // 3. Hacer la petición a Express
    try {
        const response = await fetch('http://localhost:3000/cotizacion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Error al guardar cotización');

        const data = await response.json();

        ultimaCotizacion = payload;

        // 4. Desplegar los resultados devueltos por el backend
        document.getElementById('res-subtotal').textContent = `$${data.subtotal.toFixed(2)}`;
        document.getElementById('res-descuento').textContent = `$${data.descuento.toFixed(2)}`;
        document.getElementById('res-total').textContent = `$${data.total.toFixed(2)}`;
        document.getElementById('res-utilidad').textContent = `$${data.utilidadTotal.toFixed(2)}`;

        document.getElementById('result-card').classList.remove('hidden');

    } catch (error) {
        alert(' Hubo un problema al procesar la cotización.');
        console.error(error);
    }
});


//aqui sucede la magia del excel muchachos:
document.getElementById('btn-descargar-excel').addEventListener('click', async () => {

    if (!ultimaCotizacion) {
        alert('Primero debes calcular una cotización.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cotizacion/excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ultimaCotizacion)
        });

        if (!response.ok) {
            throw new Error('No se pudo generar el Excel');
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
        alert('Hubo un problema al descargar el Excel.');
    }

});
cargarFlores();