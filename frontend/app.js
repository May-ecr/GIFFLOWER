// Agregar dinámicamente campos para más flores
document.getElementById('btn-add-flor').addEventListener('click', () => {
    const container = document.getElementById('flores-container');
    const newRow = document.createElement('div');
    newRow.className = 'flor-item form-row';
    newRow.innerHTML = `
        <input type="text" class="flor-nombre" placeholder="Flor (Ej: Tulipán)" required>
        <input type="number" class="flor-cantidad" placeholder="Cant." min="1" required>
        <input type="number" class="flor-costo" placeholder="Costo C/U ($)" min="0" step="0.01" required>
    `;
    container.appendChild(newRow);
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