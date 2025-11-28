const DB_KEY = 'webchat_users';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

export async function register(userData) {
    await new Promise(r => setTimeout(r, 500));
    
    const { username, email, password, confirmPassword } = userData;
    
    if (!username || !email || !password) {
        throw new Error('Todos los campos son requeridos');
    }
    
    if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
    }
    
    if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const users = getUsers();
    
    if (users.find(u => u.username === username)) {
        throw new Error('El usuario ya existe');
    }
    
    if (users.find(u => u.email === email)) {
        throw new Error('El email ya está registrado');
    }
    
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: btoa(password),
        name: username,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return {
        user: { id: newUser.id, username: newUser.username, email: newUser.email, name: newUser.name },
        token: `token_${newUser.id}`
    };
}

export async function login(username, password) {
    await new Promise(r => setTimeout(r, 500));
    
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || btoa(password) !== user.password) {
        throw new Error('Usuario o contraseña inválidos');
    }
    
    return {
        user: { id: user.id, username: user.username, email: user.email, name: user.name },
        token: `token_${user.id}`
    };
}