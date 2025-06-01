import { useEffect, useState } from 'react';
import LayoutDashboard from './layout/layoutDashBoard';
import api from '../services/api';
import { ReadUser } from '../types/user';

const Profile: React.FC = () => {
  const [user, setUser] = useState<ReadUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user');  // Ajuste conforme a sua rota.
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        password: ''
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email
      };

      if (formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      await api.put('/user', payload);  // Ajuste conforme sua rota.
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!user) {
    return (
      <LayoutDashboard title="Perfil">
        <p>Carregando perfil...</p>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard title="Perfil">
      <div className="container mt-4">
        <h2>Meu Perfil</h2>
        <div className="card p-4 mt-3">
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Deixe em branco se não quiser alterar"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Último Acesso</label>
            <input
              type="text"
              className="form-control"
              value={new Date(user.lastAccessAt).toLocaleString()}
              disabled
              readOnly
            />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Salvar
          </button>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default Profile;
