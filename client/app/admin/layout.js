'use client';
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import UserContext from "../context/userContext.js";
import Loading from "../components/loading.js";
import NaoAutorizado from "../components/naoAutorizado.js";
import EmpContext from "../context/empContext.js";
import { useRouter } from "next/navigation";

export default function adminPage({ children }) {

    let router = useRouter();

    const { user, setUser } = useContext(UserContext); // usuário que vem do contexto que está logado
    const { emp, setEmp } = useContext(EmpContext); // empresa que vem do localStorage
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        setIsClient(true);

        // Carregar usuário do localStorage
        const localUser = localStorage.getItem('usuario');
        if (localUser) {
            setUser(JSON.parse(localUser)); // Atualiza o usuário no contexto
        }

        // Carregar empresa do localStorage
        const localEmpresa = localStorage.getItem('empresa');
        if (localEmpresa) {
            setEmp(JSON.parse(localEmpresa)); // Define a empresa corretamente
        }

        setLoading(false);
    }, [setUser, setEmp]); // Inclua setEmp nas dependências

    const isAdmin = user && user.usuNivel === 0;

    const handleLogout = () => {
        // Remover usuário e empresa do localStorage

        fetch('http://localhost:5000/login/logout', {
                mode: 'cors',
                credentials: 'include',
                method: "GET",
                headers:{
                    "Content-type": "application/json",
                },
        }).then(r=> {
            return r.json()
        })

        localStorage.removeItem('usuario');
        localStorage.removeItem('empresa');
        // Atualizar o contexto para remover as informações de user e emp
        setUser(null);
        setEmp(null);
        // Redirecionar o usuário para a página de login ou outra página pública
        router.push('/');
    };

    if (loading) {
        return <Loading />;
    }

    if (isClient) {
        if (user == null) {
            return <NaoAutorizado />;
        }
    }
    return(
        <header>
         <div className="layout">
            <aside className="sidebar">
                <ul>
                    <img src="/img/logotipo primus.png" className="img-format"></img>
                    <hr></hr>
                    <li><h2>Bem vindo</h2></li>
                    <li> <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fa-solid fa-user" style={{color: "#ffffff"}}></i>
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user != null && isClient ? user.usuNome : "Carregando..."}</span>
                    
                    </a></li>
                    <li> <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fa-solid fa-users" style={{color: "#ffffff"}}></i>
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small p-1">{emp != null && isClient ? emp.empNome : ""}</span>
                    
                    </a></li>
                    <hr></hr>
                    <li><a href="/admin">Home</a></li>
                    {isAdmin && <li><Link href="/admin/usuarios">Usuarios</Link></li>}
                    <li><a href="/admin/empresas">Empresas</a></li>
                    <li><a href="/admin/comunicacao">Comunicação</a></li>
                    <li>
                        {/* Botão de Logout */}
                        <button onClick={handleLogout} style={{ color: "#ffffff", background: "transparent", border: "none", cursor: "pointer" }}>
                            <i className="fa-solid fa-sign-out-alt" style={{color: "#ffffff"}}></i> Logout
                        </button>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                {children}
            </main>
         </div>
        </header>
    )
}