import { useEffect, useState } from 'react';
import LayoutDashboard from './layout/layoutDashBoard';
import api from '../services/api';
import { Route } from '../types/routes';

const Routes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <LayoutDashboard title="Rotas">
      <div className="container mt-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Caminho</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route.id}>
                  <td>{route.id}</td>
                  <td>{route.url}</td>
                  <td>{route.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default Routes;
