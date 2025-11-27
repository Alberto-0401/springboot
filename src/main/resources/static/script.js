window.addEventListener('DOMContentLoaded', cargarEnemigos);

async function cargarEnemigos(){
    try{
        const response = await fetch('api/enemigo');
        const enemigos = await response.json();
        mostrarEnemigos(enemigos);
    }catch(error){
        console.error("error al cargar los usuarios" + error)
    }//FIN CATCH
}//FIN CARGAR ENEMIGOS

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

        }else{
            const error = await response.text();
            console.log(error);
        }
    }catch(error){
        console.error(error);
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

                // Restaurar el formulario para agregar
                location.reload();
            }else{
                const error = await response.text();
                console.error('Error:', error);
                alert('Error al actualizar el enemigo');
            }
        }catch(error){
            console.error('Error:', error);
            alert('Error al actualizar el enemigo');
        }finally{
            btnSubmit.disabled = false;
        }
    };
}//Fin editar
