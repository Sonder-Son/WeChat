export const registerService = async (username, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find((u) => u.username === username);
  if (userExists) throw new Error("El usuario ya existe");

  const newUser = { username, password };
  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  return newUser;
};

export const loginService = async (username, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) throw new Error("Credenciales incorrectas");

  return user;
};
