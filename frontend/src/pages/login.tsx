import './login.css';
import api from '../services/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {

            if (email === "" || password === "") {
                alert("Preencha todos os campos");
                return;
            }

            await api.post("/auth/login", { email, password }).then((response) => {
                if (response.status === 201)  {
                    alert("Login realizado com sucesso");
                    localStorage.setItem("token", response.data.access_token);
                    window.location.href = "/user";
                }
                                   
            }).catch(((err): void => {
                if (err.response.status === 401) {
                    alert("E-mail ou senha incorretos");
                }
                if (err.response.status === 400) {
                    alert("E-mail ou senha inválidos");
                }
            }
            ));
            
        } catch (err) {
            console.error("Erro ao fazer login", err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="p-4 shadow rounded bg-white" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <h1>MyApp</h1>
                </div>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail:</label>
                        <input type="email" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="senha" className="form-label">Senha:</label>
                        <div className="input-group">
                        <input type="password" className="form-control" id="floatingPassword" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto mb-3 mt-5">
                        <button type="button" className="btn btn-success" onClick={()=> handleLogin()}>Login</button>
                    </div>
                    <div className="text-center mb-3">
                        <Link to={"/register"} className="text-decoration-none">
                            Não possui uma conta? <strong>Cadastre-se</strong>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;