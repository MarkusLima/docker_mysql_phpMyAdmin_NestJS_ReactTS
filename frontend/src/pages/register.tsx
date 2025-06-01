import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {

    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const register = async ()=>{

        try {
            
            if (email === "" || name === "" || password === ""){
                alert("Preencha todos os campos");
                return;
            }

             await api.post("/auth/register", { name, email, password }).then((response) => {
                if (response.status === 201)  {
                    localStorage.setItem("token", response.data.access_token);
                    alert("Register realizado com sucesso");
                    window.location.href = "/";
                }                               
            }).catch((err => {
                if (err.response.status === 409) {
                    alert("Email já cadastrado");
                }
                if (err.response.status === 400) {
                    alert("Bad Request: " + err.response.data.message);
                }
            }
            ));
        } catch (error) {
            console.error("Erro ao realizar registro: ", error);
            alert(error);
        }

    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="p-4 shadow rounded bg-white" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <h1>MyApp</h1>
                </div>
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Seu nome completo <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" id="email" 
                            onChange={(e)=> setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Senha <span className="text-danger">*</span></label>
                        <div className="input-group">
                        <input type="password" className="form-control" id="floatingPassword" onChange={(e)=> setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className="d-grid gap-2 col-6 mx-auto mb-3 mt-5">
                        <button type="button" className="btn btn-success" onClick={()=>register()}>Criar conta</button>
                    </div>
                    <div className="text-center">
                        <Link to="/" className="text-decoration-none">
                        Já possui uma conta? <strong>Fazer o login</strong>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;