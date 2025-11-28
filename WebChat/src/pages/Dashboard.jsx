import "./Dashboard.css";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Bienvenido {user?.username}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;
