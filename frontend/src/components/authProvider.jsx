// authProvider.js
const authProvider = {
    login: async ({ username, password }) => {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            body: JSON.stringify({ correo: username, password: password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Login failed');

        const { token, usuario } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        return Promise.resolve();
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        return Promise.resolve();
    },

    checkAuth: () =>
        localStorage.getItem('token') ? Promise.resolve() : Promise.reject(),

    checkError: (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getIdentity: () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        return Promise.resolve({ id: usuario?.id, fullName: usuario?.nombre });
    },

    getPermissions: () => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    return Promise.resolve(user?.roll); // Devuelve 'admin' o lo que tengas
    },
};

export default authProvider;
