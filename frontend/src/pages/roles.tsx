import { useEffect, useState } from 'react';
import LayoutDashboard from './layout/layoutDashBoard';
import api from '../services/api';
import { Role } from '../types/role';

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formRole, setFormRole] = useState<{ name: string }>({ name: '' });

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');

      setRoles(response.data);
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/roles/${id}`);
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error('Erro ao deletar role:', error);
    }
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormRole({ name: role.name });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setFormRole({ name: '' });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, formRole);
        setRoles(roles.map(role => role.id === editingRole.id ? { ...role, ...formRole } : role));
      } else {
        const response = await api.post('/roles', formRole);
        setRoles([...roles, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar role:', error);
    }
  };

  return (
    <LayoutDashboard title="Perfis">
      <div className="container mt-4">
        <div className="d-flex mb-3 gap-2">
          <button className="btn btn-primary" onClick={openCreateModal}>
            Criar Perfil
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(role)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(role.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingRole ? 'Editar Perfil' : 'Criar Perfil'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formRole.name}
                      onChange={e => setFormRole({ name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    {editingRole ? 'Salvar Alterações' : 'Criar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default Roles;
