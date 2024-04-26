<template>
    <main class="container-login">
        <div class="contenedor-lf">
            <header>

                <img src="../assets/blog.png" alt="">
            </header>
            <form @submit.prevent="fethching">
                <div class="grupo">
                    <label for="correo">Correo:</label>
                    <input type="text" placeholder="usuario@correo.com" id="correo" v-model.trim="usuario">
                </div>
                <div class="grupo">
                    <label for="password">Password:</label>
                    <input type="password" placeholder="**********" id="password" v-model.trim="password">
                </div>
                <div class="grupo enviar">
                    <button type="submit" id="submit">Iniciar sesión</button>
                </div>


            </form>

            <footer>
                <article class="cc">Crear usuario
                    <span>
                        <RouterLink to="/registrarte">Aquí</RouterLink>
                    </span>
                </article>

            </footer>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Swal from 'sweetalert2'


let usuario = ref("");
let password = ref("");
let correovalido = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


function fethching() {


    if (!correovalido.test(usuario.value)) {
        alerta("Usuario Invalido", "warning")
        return;
    }

    if ((password.value).length < 1) {
        alerta("La contraseña/password no debe ir vacia", "warning")
        return;
    }


    login(usuario.value, password.value);


}

async function login(usuario, password) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ email: usuario, password: password })
    };


    try {
        const response = await fetch('http://localhost:8080/api/login', options);
        

        if (!response.ok) {
            alerta("Credenciales invalidas", "warning");
            return;
        }
        const responseData = await response.json();
    
        localStorage.setItem('token', responseData.jwt);

        Swal.fire({
            title: responseData.message,
            timer: 2000,
            icon: "success",
            timerProgressBar: true

        }).then((result) => {
            window.location.href = '/blogs';
        });

    } catch (error) {
        console.error(error); // Handle errors appropriately
    }
}



function alerta(mensaje, icono) {
    Swal.fire({
        title: mensaje,
        text: "",
        icon: icono
    });
}
</script>
<style scoped src="../assets/login_register.css">

</style>