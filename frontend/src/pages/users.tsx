import { useEffect, useState } from 'react';
import LayoutDashboard from './layout/layoutDashBoard';
import { User, ReadUser } from '../types/user';
import api from '../services/api';
import { Role } from '../types/role';

const Users: React.FC = () => {
  const [users, setUsers] = useState<ReadUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formUser, setFormUser] = useState<Omit<User, 'id'> & { password: string }>({
    name: '',
    email: '',
    roleId: 1,
    password: ''
  });

  const [filterRole, setFilterRole] = useState<string>('');  // filtro de role
  const [sortBy, setSortBy] = useState<string>('name');      // nome ou createdAt
  const [order, setOrder] = useState<string>('asc');         // asc ou desc

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (filterRole) params.role = filterRole;
      if (sortBy) params.sortBy = sortBy;
      if (order) params.order = order;

      const response = await api.get('/users?role=' + filterRole + '&sortBy=' + sortBy + '&order=' + order);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

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

  useEffect(() => {
    fetchUsers();
  }, [filterRole, sortBy, order]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormUser({ 
      name: user.name, 
      email: user.email, 
      roleId: user.roleId, 
      password: '' 
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormUser({
      name: '',
      email: '',
      roleId: roles.length > 0 ? roles[0].id : 1,
      password: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formUser);
        setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...formUser } : user));
      } else {
        const response = await api.post('/users', formUser);
        setUsers([...users, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <LayoutDashboard title="Usuários">
      <div className="container mt-4">
        <div className="d-flex mb-3 gap-2">
          <button className="btn btn-primary" onClick={openCreateModal}>
            Criar Usuário
          </button>

          <select
            className="form-select w-auto"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="">Todos os Perfis</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <select
            className="form-select w-auto"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Ordenar por Nome</option>
            <option value="createdAt">Ordenar por Data de Criação</option>
            <option value="lastAcessAt">Ordernar por utimo acesso</option>
          </select>

          <select
            className="form-select w-auto"
            value={order}
            onChange={e => setOrder(e.target.value)}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Último acesso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.roleId}-{getRoleName(user.roleId)}</td>
                  <td>{new Date(user.lastAccessAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
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
                    {editingUser ? 'Editar Usuário' : 'Criar Usuário'}
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
                      value={formUser.name}
                      onChange={e => setFormUser({ ...formUser, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formUser.email}
                      onChange={e => setFormUser({ ...formUser, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Perfil</label>
                    <select
                      className="form-select"
                      value={formUser.roleId}
                      onChange={e => setFormUser({ ...formUser, roleId: Number(e.target.value) })}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formUser.password}
                      onChange={e => setFormUser({ ...formUser, password: e.target.value })}
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
                    {editingUser ? 'Salvar Alterações' : 'Criar'}
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

export default Users;
