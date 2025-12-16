window.addEventListener('DOMContentLoaded', cargarEnemigos);

let enemigosCargados = [];

async function cargarEnemigos(){
    try{
        const response = await fetch('api/enemigo');
        const enemigos = await response.json();
        enemigosCargados = enemigos;
        mostrarEnemigos(enemigos);
    }catch(error){
        console.error("error al cargar los usuarios" + error);
        mostrarMensaje("Error al cargar los enemigos", "error");
    }//FIN CATCH
}//FIN CARGAR ENEMIGOS

async function buscarPorNombre(){
    const nombre = document.getElementById('searchInput').value.trim();

    if(!nombre){
        mostrarMensaje("Por favor ingresa un nombre para buscar", "error");
        return;
    }

    try{
        const response = await fetch(`api/enemigo/buscar?nombre=${encodeURIComponent(nombre)}`);
        const enemigos = await response.json();

        if(enemigos.length === 0){
            mostrarMensaje(`No se encontraron enemigos con el nombre "${nombre}"`, "warning");
        } else {
            mostrarMensaje(`Se encontraron ${enemigos.length} resultado(s)`, "success");
        }

        enemigosCargados = enemigos;
        mostrarEnemigos(enemigos);
    }catch(error){
        console.error("Error al buscar:", error);
        mostrarMensaje("Error al realizar la búsqueda", "error");
    }
}

function ordenarAlfabeticamente(){
    const enemigosOrdenados = [...enemigosCargados].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    mostrarEnemigos(enemigosOrdenados);
    mostrarMensaje("Lista ordenada alfabéticamente", "success");
}

async function descargarCSV(){
    try{
        const response = await fetch('api/enemigo/csv');

        if(response.ok){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'enemigos.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            mostrarMensaje("CSV descargado exitosamente", "success");
        } else {
            mostrarMensaje("Error al descargar el CSV", "error");
        }
    }catch(error){
        console.error("Error al descargar CSV:", error);
        mostrarMensaje("Error al descargar el CSV", "error");
    }
}

function mostrarMensaje(texto, tipo){
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';

    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 4000);
}

function mostrarEnemigos(enemigos){
    const tbody = document.getElementById('enemigosBody');
    tbody.innerHTML = '';

    if (enemigos.length === 0){
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay enemigos registrados</td></tr>';
        return;
    }

    enemigos.forEach(enemigo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${enemigo.id}</td>
        <td>${enemigo.name}</td>
        <td>${enemigo.partido}</td>
        <td>
            <button class="btn-editar" onclick="editarEnemigo(${enemigo.id}, '${enemigo.name}', '${enemigo.partido}')">Editar</button>
            <button class="btn-eliminar" onclick="eliminarEnemigo(${enemigo.id})">Borrar</button>
        </td>
        `;
        tbody.appendChild(tr);
    });
}//FIN MOSTRAR

//Aqui empezamos con la parte de insertar
document.getElementById('formInsertarEnemigo').addEventListener('submit', async function(e){
    e.preventDefault();

    const name = document.getElementById('nombre').value;
    const partido = document.getElementById('partido').value;
    const btnSubmit = document.getElementById('btnSubmit');

    // Validación del lado del cliente
    if(name.length < 3){
        mostrarMensaje("El nombre debe tener al menos 3 caracteres", "error");
        return;
    }

    // Mientras se procesa
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando a francia...';

    try{
        const response = await fetch('api/enemigo',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    partido: partido
                })
        });
        if(response.ok){
            const enemigos = await response.json();
            document.getElementById('formInsertarEnemigo').reset();
            await cargarEnemigos(); //Cargar enemigos
            mostrarMensaje("Enemigo agregado exitosamente", "success");

        }else{
            const errorData = await response.json();
            let errorMsg = errorData.error || "Error al crear el enemigo";

            if(errorData.name){
                errorMsg = errorData.name;
            }

            mostrarMensaje(errorMsg, "error");
            console.log(errorData);
        }
    }catch(error){
        console.error(error);
        mostrarMensaje("Error de conexión con el servidor", "error");
    }finally{
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Agregar Enemigo';
    }//Fin try
});

//Funcion para eliminar enemigo
async function eliminarEnemigo(id){
    if(!confirm('¿Estás seguro de que quieres eliminar este enemigo?')){
        return;
    }

    try{
        const response = await fetch(`api/enemigo/${id}`, {
            method: 'DELETE'
        });

        if(response.ok){
            console.log('Enemigo eliminado correctamente');
            await cargarEnemigos(); //Recargar la tabla
        }else{
            const error = await response.text();
            console.error('Error al eliminar:', error);
            alert('Error al eliminar el enemigo');
        }
    }catch(error){
        console.error('Error:', error);
        alert('Error al eliminar el enemigo');
    }
}//Fin eliminar

//Funcion para editar enemigo
function editarEnemigo(id, name, partido){
    // Rellenar el formulario con los datos actuales
    document.getElementById('nombre').value = name;
    document.getElementById('partido').value = partido;

    // Cambiar el texto del botón
    const btnSubmit = document.getElementById('btnSubmit');
    btnSubmit.textContent = 'Actualizar Enemigo';

    // Cambiar el comportamiento del formulario
    const form = document.getElementById('formInsertarEnemigo');

    // Remover el listener anterior
    form.onsubmit = async function(e){
        e.preventDefault();

        const nameNuevo = document.getElementById('nombre').value;
        const partidoNuevo = document.getElementById('partido').value;

        // Validación del lado del cliente
        if(nameNuevo.length < 3){
            mostrarMensaje("El nombre debe tener al menos 3 caracteres", "error");
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Actualizando...';

        try{
            const response = await fetch(`api/enemigo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    name: nameNuevo,
                    partido: partidoNuevo
                })
            });

            if(response.ok){
                console.log('Enemigo actualizado correctamente');
                form.reset();
                btnSubmit.textContent = 'Agregar Enemigo';
                mostrarMensaje("Enemigo actualizado exitosamente", "success");

                // Restaurar el formulario para agregar
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }else{
                const errorData = await response.json();
                let errorMsg = errorData.error || "Error al actualizar el enemigo";

                if(errorData.name){
                    errorMsg = errorData.name;
                }

                mostrarMensaje(errorMsg, "error");
                console.error('Error:', errorData);
            }
        }catch(error){
            console.error('Error:', error);
            mostrarMensaje("Error de conexión con el servidor", "error");
        }finally{
            btnSubmit.disabled = false;
        }
    };
}//Fin editar
