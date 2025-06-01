import { useEffect, useState } from 'react';
import LayoutDashboard from './layout/layoutDashBoard';
import api from '../services/api';
import { Permission, ReadPermission } from '../types/permissions';
import { Role } from '../types/role';
import { Route } from '../types/routes';

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<ReadPermission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  const [formPermission, setFormPermission] = useState<Permission>({
    roleId: 0,
    routeId: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<ReadPermission | null>(null);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
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

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchRoutes();
    fetchPermissions();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingPermission) {
        const response = await api.put('/permissions/'+editingPermission.id, formPermission);
        setPermissions(
          permissions.map(p =>
            p.roleId === editingPermission.roleId && p.routeId === editingPermission.routeId
              ? response.data
              : p
          )
        );
      } else {
        const response = await api.post('/permissions', formPermission);
        setPermissions([...permissions, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar permissão:', error);
    }
  };

  const handleDelete = async (permission: ReadPermission) => {
    try {
      await api.delete(`/permissions/${permission.id}`);
      setPermissions(
        permissions.filter(
          p => !(p.roleId === permission.roleId && p.routeId === permission.routeId)
        )
      );
    } catch (error) {
      console.error('Erro ao deletar permissão:', error);
    }
  };

  const openCreateModal = () => {
    setEditingPermission(null);
    setFormPermission({
      roleId: roles.length > 0 ? roles[0].id : 0,
      routeId: routes.length > 0 ? routes[0].id : 0
    });
    setShowModal(true);
  };

  const openEditModal = (permission: ReadPermission) => {
    setEditingPermission(permission);
    setFormPermission({ roleId: permission.roleId, routeId: permission.routeId });
    setShowModal(true);
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  const getRouteName = (routeId: number) => {
    const route = routes.find(r => r.id === routeId);
    return route ? `${route.method} ${route.url}` : routeId;
  };

  return (
    <LayoutDashboard title="Permissões">
      <div className="container mt-4">
        <div className="d-flex mb-3 gap-2">
          <button className="btn btn-primary" onClick={openCreateModal}>
            Criar Permissão
          </button>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Id</th>
                <th>Perfil</th>
                <th>Rota</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, index) => (
                <tr key={index}>
                  <td>{permission.id}</td>
                  <td>{permission.roleId}-{getRoleName(permission.roleId)}</td>
                  <td>{permission.routeId}-{getRouteName(permission.routeId)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(permission)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(permission)}
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
                    {editingPermission ? 'Editar Permissão' : 'Criar Permissão'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Perfil</label>
                    <select
                      className="form-select"
                      value={formPermission.roleId}
                      onChange={e => setFormPermission({ ...formPermission, roleId: Number(e.target.value) })}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rota</label>
                    <select
                      className="form-select"
                      value={formPermission.routeId}
                      onChange={e => setFormPermission({ ...formPermission, routeId: Number(e.target.value) })}
                    >
                      {routes.map(route => (
                        <option key={route.id} value={route.id}>
                          {route.method} {route.url}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={()=>handleSubmit()}>
                    {editingPermission ? 'Salvar Alterações' : 'Criar'}
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

export default Permissions;
