import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './layoutDashboard.css';
import { LayoutDashboardProps } from '../../types/layout';

function LayoutDashboard({ title, children }: LayoutDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const deleteTokenLocalStorage = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="d-flex">
      <nav
        ref={sidebarRef}
        className={`sidebar bg-success text-white p-3 ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`}
      >
        <h3 className="mb-3 mt-3 fw-bold">Menu</h3>
        <ul className="nav flex-column">
          <li className="nav-item text-start">
            <Link to="/user" className="nav-link text-white mt-1 mb-1 fw-bold" onClick={() => setSidebarOpen(false)}>
              Profile
            </Link>
          </li>
          <li className="nav-item text-start">
            <Link to="/users" className="nav-link text-white mt-1 mb-1 fw-bold" onClick={() => setSidebarOpen(false)}>
              Usuários
            </Link>
          </li>
          <li className="nav-item text-start">
            <Link to="/roles" className="nav-link text-white mt-1 mb-1 fw-bold" onClick={() => setSidebarOpen(false)}>
              Perfis
            </Link>
          </li>
          <li className="nav-item text-start">
            <Link to="/permissions" className="nav-link text-white mt-1 mb-1 fw-bold" onClick={() => setSidebarOpen(false)}>
              Permissões
            </Link>
          </li>
          <li className="nav-item text-start">
            <Link to="/routes" className="nav-link text-white mt-1 mb-1 fw-bold" onClick={() => setSidebarOpen(false)}>
              Rotas
            </Link>
          </li>
          <li className="nav-item text-start">
            <Link to="/" className="nav-link text-white mt-1 mb-1 fw-bold" onClick={() => deleteTokenLocalStorage()}>
              Deslogar
            </Link>
          </li>
        </ul>
      </nav>

      <div className="content flex-grow-1">
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <button className="btn btn-outline-primary d-md-none" onClick={toggleSidebar}>
              ☰
            </button>
            <span className="navbar-brand mb-0 h1">{title}</span>
          </div>
        </nav>

        <div className="container mt-4">
          <div className="card">
            <div className="card-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutDashboard;
