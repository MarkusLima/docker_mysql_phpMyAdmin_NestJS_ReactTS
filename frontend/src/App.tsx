import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import User from './pages/user';
import Users from './pages/users';
import Roles from './pages/roles';
import RoutesSystem from './pages/routes';
import Permissions from './pages/permissions';
import Unauthorized from './pages/unauthorized';
import Login from './pages/login';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/register';

function App() {

  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={ isAuthenticated ? <Navigate to="/user" replace /> : <Login />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/routes" element={<RoutesSystem />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
