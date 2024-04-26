import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Asegúrate de cambiar la URL base según tu configuración
  });

axiosInstance.interceptors.request.use(
    
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log("token");
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
    response => response,
    error => {

        console.log("aqui tiene que pasar");
        // if (error.response.status === 401) {
        //     // Si el token no es válido, puedes agregar lógica de redireccionamiento aquí
        //     localStorage.removeItem('token');
        //     // Por ejemplo, redirigir a la página de inicio de sesión
        //     window.location.href = '/login';
        // }
        return Promise.reject(error);
    }
);
export { axiosInstance };