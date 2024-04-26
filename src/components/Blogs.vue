<script setup>
import axios from 'axios';
import { ref, onBeforeUnmount, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'


let visiblepaginator = ref(false);
let titulo = ref("");
let content = ref("");
let autor = ref("");
let bearerToken = ref("");
let blogs = ref([]);
let bandera = ref(1);
let isModalVisible = ref(false);
let modalvisiblecreate = ref(false);
let token = localStorage.getItem("token");
let string = new String(token);
let bearer = "Bearer " + string.toString() + "";
let id_blog = ref(0);
let selectOption = ref("");
let inputfiltro = ref("");
let current = ref(1);
let total = ref(1);

const options = {
    method: 'GET',
    headers: {
        Authorization: bearer,
    }
};

onMounted(() => {
    obtenerBlogs(current.value);
});


const obtenerBlogs = async (pagina) => {
    try {
        const opciones = {
            method: 'GET',
            headers: {
                Authorization: bearer
            }
        };

        //Se hace la peticion a la api rest
        const respuesta = await fetch(`http://localhost:8080/api/blog?page=${current.value}&${selectOption.value}${selectOption.value == '' ? '' : '='}${inputfiltro.value}`, opciones);

        //si es diferente de 200 el codigo http, nos deslogea y pide que nos autentiquemos de nuevo
        if (!respuesta.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        const datos = await respuesta.json();
        current.value = datos.pagination.current_page;
        total.value = datos.pagination.total_pages;
        blogs.value = datos;
        bandera.value = 1;

    } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};




let logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
}



async function createBlog() {
    let token = localStorage.getItem("token");

    let string = new String(token);
    let bearer = "Bearer " + string.toString() + "";
    bearerToken.value = bearer;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: bearer
        },
        body: JSON.stringify({ title: titulo.value, content: content.value, autor: autor.value })
    };

    fetch('http://localhost:8080/api/blog', options)
        .then(response => response.json())
        .then(async response => {

            if (response.success) {
                let reloaDR = await reloadDataRender();
                blogs.value = reloaDR;
                titulo.value = "";
                content.value = ""
                autor.value = ""
                modalvisiblecreate.value = false;
                Swal.fire({
                    title: "Creado!",
                    text: "Se ha Creado con exito el blog",
                    icon: "success",
                    timer: 1800
                });
            } else {
                Swal.fire({
                    title: "¡Ocurrio un problema!",
                    text: response.message,
                    icon: "warning",
                    timer: 1800
                });
            }

        })
        .catch(err => {
           
            localStorage.removeItem('token');
            window.location.href = '/login';
        });
}



async function reloadDataRender() {
    const optionsDR = {
        method: 'GET',
        headers: {
            Authorization: bearer,
        }
    };

    try {
        const response = await fetch('http://localhost:8080/api/blog', optionsDR);
        if (!response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        const responseData = await response.json();

        return responseData;
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

}




async function mostrarModalEditar(item) {

    isModalVisible.value = true;
    let blog = await getBLOG(item);

    titulo.value = blog.data.title;
    content.value = blog.data.content;
    autor.value = blog.data.autor;
    id_blog.value = item;


}

async function getBLOG(id) {

    const optionsG = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: bearer
        },

    };


    try {
        const response = await fetch('http://localhost:8080/api/blog/' + id + '', optionsG);
        if (!response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        const responseData = await response.json();

        return responseData;
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}





//Muestra un sweel alert para la confirmacion al momento de elimina una tarea
async function modaldelete(id_blog) {
    Swal.fire({
        title: "¿Seguro que desea eliminar el blog?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",

    }).then((result) => {
        if (result.isConfirmed) {

            const optionsG = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: bearer
                },
            };

         
            fetch('http://localhost:8080/api/blog/' + id_blog + '', optionsG)
                .then(response => response.json())
                .then(async response => {

                 
                    if (response.success) {
                        const options = {
                            method: 'GET',
                            headers: {
                                Authorization: bearer,
                            }
                        };


                        fetch(`http://localhost:8080/api/blog?page=${current.value}&${selectOption.value}${selectOption.value == '' ? '' : '='}${inputfiltro.value}`, options)
                            .then(response => response.json())
                            .then(response => {
                                blogs.value = response;
                            })
                            .catch(err => {
                                window.location.href = '/login';
                            });
                        Swal.fire({
                            title: "¡Eliminado!",
                            text: response.message,
                            icon: "success",
                            timer: 1800
                        });

                    } else {
                        Swal.fire({
                            title: "¡No eliminada!",
                            text: response.message,
                            icon: "error",
                            timer: 1800
                        });
                    }


                })
                .catch(err => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                });

        }
    });
}




function cancelSendData() {
    titulo.value = "";
    content.value = "";
    autor.value = "";
    isModalVisible.value = false;
    modalvisiblecreate.value = false;
}




async function update() {



    let string = new String(token);
    let bearer = "Bearer " + string.toString() + "";
    bearerToken.value = bearer;

    const optionsP = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: bearer
        },
        body: JSON.stringify({ title: titulo.value, autor: autor.value, content: content.value })
    };

    fetch('http://localhost:8080/api/blog/' + id_blog.value, optionsP)
        .then(response => response.json())
        .then(async response => {


            if (response.success) {
                let reloaDR = await reloadDataRender();
                blogs.value = reloaDR;

                titulo.value = "";
                
                isModalVisible.value = false;
                Swal.fire({
                    title: "Actualizada!",
                    text: response.message,
                    icon: "success",
                    timer: 1800
                });
            } else {
                Swal.fire({
                    title: "¡Ocurrio un problema!",
                    text: response.message,
                    icon: "warning",
                    timer: 1800
                });
            }
        })
        .catch(err => {
            
            localStorage.removeItem('token');
            window.location.href = '/login';
        });
}

function filterBlog() {



    if (!inputfiltro.value) {
        Swal.fire({
            title: "¡Requerido!",
            text: "Es requrido que ingrese texto para filtrar",
            icon: "warning",
            timer: 1800
        });
        return;
    }
    else if (!selectOption.value) {
        Swal.fire({
            title: "¡Requerido!",
            text: "Es requrido el tipo de filtro",
            icon: "warning",
            timer: 1800
        });
        return;
    }

    reloadDataRenderFilter();

}
function handleNextPage() {
    let auxcurrent = current.value;
    current.value++;
    if (current.value <= total.value) {
        reloadDataRenderFilter();
        return;
    }
    current.value--;
    return;
}
function handlePreviousPage() {
    let auxcurrent = current.value;

    current.value--;
    if (current.value != 0) {

        reloadDataRenderFilter();
        return;
    }
    current.value++;
    return;
}



async function reloadDataRenderFilter() {


    const optionsDR = {
        method: 'GET',
        headers: {
            Authorization: bearer,
        }
    };

    try {
        const response = await fetch(`http://localhost:8080/api/blog?page=${current.value}&${selectOption.value}${selectOption.value == '' ? '' : '='}${inputfiltro.value}`, optionsDR);
        if (!response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        const responseData = await response.json();
        blogs.value = responseData;
        current.value = responseData.pagination.current_page;
        total.value = responseData.pagination.total_pages;
        return responseData;
    } catch (error) {
      
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

}



</script>

<template class="template_todo">
    <main class="conenedor-todos">
        <div class="enb">
            <header class="headertodo">
                <article>
                    <img src="../assets/tareas.png" alt="">
                </article>
                <article>
                    <button @click="logout">cerrar sesion</button>
                </article>


            </header>


            <section>
                <span @click="modalvisiblecreate = true">+</span>
            </section>




            <div class="Filtros">
                <input type="text" name="inputfiltro" id="inputfiltro" placeholder="Ingresa el texto a buscar"
                    v-model="inputfiltro">
                <select name="selectOption" id="selectOption" v-model="selectOption">
                    <option value=""> Seleccione una opción</option>
                    <option value="title">Título</option>
                    <option value="content">Contenido</option>
                    <option value="autor">autor</option>
                </select>
                <button @click="filterBlog">Aplicar filtro</button>
            </div>


            <div v-if="bandera" class="datos_rendering">

                <table id="customers">
                    <tr>
                        <th>Título</th>
                        <th>Contenido</th>
                        <th>Autor</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    <tr v-for="item in blogs.data">
                        <td>{{ item.title }}</td>
                        <td>{{ item.content }}</td>
                        <td>{{ item.autor }}</td>
                        <td @click="mostrarModalEditar(item.id_blog)">
                            <i class="fa fa-pencil" aria-hidden="true" data-id="item.id"></i>
                        </td>
                        <!-- <td @click="modalShow(item.id)"><i class="fa fa-eye" aria-hidden="true"></i></td> -->
                        <td @click="modaldelete(item.id_blog)"><i class="fa fa-trash" style="color: red;"
                                aria-hidden="true"></i></td>


                    </tr>

                </table>
            </div>

            <!-- <q-pagination v-model="current" :max="total" input color="purple" /> -->

            <div class="pagination">

                <button @click="handlePreviousPage">Previous</button>

                <span class="current">{{ current }}</span>
                <span class="diagonal">/</span>
                <span class="total_p">{{ total }}</span>
                <button @click="handleNextPage">Next</button>

            </div>


        </div>


    </main>




    <!-- Esta sección es para el modal de mostrar y -->
    <div v-if="isModalVisible" class="modal-contenedor">
        <div class="modal">
            <div class="modal-content">
                <h1>Blog</h1>
                <section>
                    <label for="titulo">Titulo</label>
                    <input type="text" id="titulo" v-model.trim="titulo" placeholder="Título">
                    <label for="autor">Autor</label>
                    <input type="text" id="autor" v-model.trim="autor" placeholder="Autor">
                    <label for="descripcion">Contenido</label>
                    <textarea rows="10" cols="40" id="descripcion" v-model.trim="content"
                        placeholder="Contenido"></textarea>

                </section>

                <section class="buttons">
                    <button @click="cancelSendData">Cancelar</button>
                    <button @click="update">Guardar</button>
                </section>
            </div>
        </div>
    </div>


    <!-- Modal para la creacion de un post blog -->

    <div v-if="modalvisiblecreate" class="modal-contenedor modal-delete">
        <div class="modal">
            <div class="modal-content">
                <h1>Blog</h1>
                <section>
                    <input type="text" id="titulo" v-model.trim="titulo" placeholder="Título">
                    <input type="text" id="titulo" v-model.trim="autor" placeholder="Autor">
                    <textarea rows="10" cols="40" id="descripcion" v-model.trim="content"
                        placeholder="Contenido"></textarea>

                </section>

                <section class="buttons">
                    <button @click="cancelSendData">Cancelar</button>
                    <button @click="createBlog">Guardar</button>
                </section>
            </div>
        </div>
    </div>
</template>




<style scoped>
.datos_rendering {

    width: 100%;
    height: auto;
}

.status-blue {
    height: 13px !important;
    width: 13px !important;
    border: 1px solid rgb(73, 142, 252);
    background-color: rgb(93, 152, 246);
    box-sizing: border-box;
    border-radius: 50%;
    display: block;
    margin: auto;
}

.status-green {
    height: 13px !important;
    width: 13px !important;
    border: 1px solid rgb(5, 149, 86);
    background-color: rgb(34, 152, 101);
    box-sizing: border-box;
    border-radius: 50%;
    display: block;
    margin: auto;
}

.status-yellow {
    height: 13px !important;
    width: 13px !important;
    border: 1px solid rgba(40, 40, 39, 0.422);
    background-color: rgb(228, 232, 0);
    box-sizing: border-box;
    border-radius: 50%;
    display: block;
    margin: auto;
}

.status-red {
    height: 13px !important;
    width: 13px !important;
    border: 1px solid rgb(232, 0, 0);
    background-color: rgb(181, 0, 0);
    box-sizing: border-box;
    border-radius: 50%;
    display: block;
    margin: auto;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(217, 217, 217, 0.485);
    z-index: 100;
}


.modal-content {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    width: 35vw;
    border-radius: 10px;
    border: 1px solid rgba(198, 198, 198, 0.764);
}

.conenedor-todos {
    width: 100vw;
    height: 100vh;
    background-color: white;
}

.enb {
    display: flex;
    justify-content: space-around;
    margin: auto;
    flex-wrap: wrap;
    width: 50vw;
}

.headertodo {
    box-sizing: border-box;
    /* border: 1px solid blue; */
    margin-top: 6vh;
    height: 6vh;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
}

.headertodo article {
    height: auto;
    width: 50%
}


.headertodo article img {
    height: 6vh;
    width: auto;
}


.headertodo article:last-of-type {
    display: flex;
    justify-content: right;
    align-items: center;
}

.headertodo article:last-of-type button {
    float: right;
    background-color: rgb(63, 62, 62);
    ;
    color: whi;

    box-sizing: border-box;
    padding: 1% 5%;
    color: white;
    border: 1px solid rgb(63, 62, 62);
    border-radius: 4px;
    font-size: 1.1rem;
    font-family: Arial, Helvetica, sans-serif;



}

.enb section {
    margin-top: 3vh;
    width: 100%;
    display: flex;
    height: 5vh;
    align-items: center;
    justify-content: center;

}

.enb section span {
    background-color: rgb(4, 0, 85);
    color: white;
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 2vh;
    cursor: pointer;
}

#customers {

    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#customers td,
#customers th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    cursor: pointer;
}

#customers tr:nth-child(even) {
    background-color: #dbdbdb;
}

#customers tr:hover {
    background-color: #ddd;
}

#customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: rgb(4, 0, 85);
    color: white;
    border: 1px solid;
}

.modal-content section {
    width: 80%;
    transform: translateX(10%);


}

.modal-content section:first-of-type,
.modal-content section:nth-last-of-type(2) {

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

}


.modal-content section:first-of-type input {
    width: 100%;
    border: 1px solid grey;
    padding: 3px 5px;
    border-radius: 3px;
    margin-bottom: 2vh;
}

.modal-content section:first-of-type textarea {
    width: 100%;
    border: 1px solid grey;
    padding: 3px 5px;
    height: 10vh;
    border-radius: 3px;
    margin-bottom: 2vh;
}

.buttons {
    box-sizing: border-box;
    margin-top: 2vh;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
}

.buttons button {
    border: 1px solid;
    padding: 5px 12px 5px 12px;
    border-radius: 5px;
    color: white;
}

.buttons button:last-of-type {
    background-color: rgb(0, 122, 45);
}

.buttons button:first-of-type {
    background-color: rgb(181, 0, 0);

}

.modal-content h1 {
    text-align: center;
    margin-bottom: 2vh;
}


.Filtros {

    width: 100%;
    padding: 1% 0%;
    margin-top: 2%;

}

.Filtros input[type=text],
.Filtros select {
    border: 2px solid rgba(0, 0, 0, 0.679);
    padding: 5px 5px;
    outline: none;
    border-radius: 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    width: 37%;
}

.Filtros select {
    padding: 4px 5px 5px 4px;
    margin-left: 2%;
}

.Filtros button {

    width: 18%;
    padding: 5px 5px;
    outline: none;
    border-radius: 4px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    margin-left: 2%;
    border: 2px solid rgba(0, 0, 0, 0.679);
    background-color: rgb(0, 85, 74);
    color: white;
}



.pagination {
    width: 40%;
    display: flex;
    /* background-color: red; */
    flex-wrap: wrap;
    justify-content: space-between;
    margin: auto;
    margin-top: 1%;

}

.pagination button {
    width: 30%;
    border: 1px solid rgb(4, 0, 85);
    background-color: rgb(4, 0, 85);
    color: white;
    border-radius: 2px;
    font-size: 1rem;
    padding: 5px 10px;
}
</style>