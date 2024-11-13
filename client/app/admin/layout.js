'use client';
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import UserContext from "../context/userContext.js";
import Loading from "../components/loading.js";
import NaoAutorizado from "../components/naoAutorizado.js";
import EmpContext from "../context/empContext.js";
import { useRouter } from "next/navigation";

export default function AdminPage({ children }) {
    let router = useRouter();

    const { user, setUser } = useContext(UserContext); // usuário que vem do contexto que está logado
    const { emp, setEmp } = useContext(EmpContext); // empresa que vem do localStorage
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false); // Estado para minimizar a sidebar

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
    }, [setUser, setEmp]);

    const isAdmin = user && user.usuNivel === 0;

    const handleLogout = () => {
        // Remover usuário e empresa do localStorage
        fetch('http://localhost:5000/login/logout', {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        }).then(r => r.json());

        localStorage.removeItem('usuario');
        localStorage.removeItem('empresa');
        // Atualizar o contexto para remover as informações de user e emp
        setUser(null);
        setEmp(null);
        // Redirecionar o usuário para a página de login ou outra página pública
        router.push('/');
    };

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized); // Alternar estado da sidebar
    };

    if (loading) {
        return <Loading />;
    }

    if (isClient && user == null) {
        return <NaoAutorizado />;
    }

    return (
        <header>
            <div className="layout">
                <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
                    <ul>
                        <img src="/img/logotipo primus.png" className={`img-format ${isMinimized ? 'hidden' : ''}`}></img>
                        <hr className={isMinimized ? 'hidden' : ''}></hr>

                        {/* Botão para minimizar/expandir a sidebar */}
                        <li>
                            <button onClick={toggleSidebar} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#fff" }}>
                                {isMinimized ? <i className="fa-solid fa-chevron-right"></i> : <i className="fa-solid fa-chevron-left"></i>}
                            </button>
                        </li>

                        {!isMinimized && (
                            <>
                                <li><h2>Bem vindo</h2></li>
                                <li>
                                    <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa-solid fa-user" style={{ color: "#ffffff" }}></i>
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small text-ellipsis">
                                            {user != null && isClient ? user.usuNome : "Carregando..."}
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa-solid fa-users" style={{ color: "#ffffff" }}></i>
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small p-1 text-ellipsis">
                                            {emp != null && isClient ? emp.empNome : ""}
                                        </span>
                                    </a>
                                </li>
                                <hr></hr>
                                <li><a href="/admin">Home</a></li>
                                {isAdmin && <li><Link href="/admin/usuarios">Usuarios</Link></li>}
                                <li><a href="/admin/empresas">Empresas</a></li>
                                <li>
                                {emp ? (
                                    <a href="/admin/comunicacao">Comunicação</a>) : (<a href="/admin/empresas" onClick={() => {alert("Por favor, selecione uma empresa antes de acessar a Comunicação.");}}
                                        style={{ color: "red", cursor: "pointer" }}>Comunicação</a>)}
                                </li>
                                <li>
                                {emp ? (
                                    <a href="/admin/protocolo">Protocolo</a>) : (<a href="/admin/empresas" onClick={() => {alert("Por favor, selecione uma empresa antes de acessar o Protocolo.");}}
                                        style={{ color: "red", cursor: "pointer" }}>Protocolo</a>)}
                                </li>
                                <li>
                                {emp ? (
                                    <a href="/admin/faturamento">Faturamento</a>) : (<a href="/admin/empresas" onClick={() => {alert("Por favor, selecione uma empresa antes de acessar o Faturamento.");}}
                                        style={{ color: "red", cursor: "pointer" }}>Faturamento</a>)}
                                </li>
                                <li>
                                {emp ? (
                                    <a href="/admin/despesa">Despesa</a>) : (<a href="/admin/empresas" onClick={() => {alert("Por favor, selecione uma empresa antes de acessar a Despesa.");}}
                                        style={{ color: "red", cursor: "pointer" }}>Despesa</a>)}
                                </li>
                                <li><a href="/admin/tipoDespesa">Tipo Despesa</a></li>
                                <li>
                                    <button onClick={handleLogout} style={{ color: "#ffffff", background: "transparent", border: "none", cursor: "pointer" }}>
                                        <i className="fa-solid fa-sign-out-alt" style={{ color: "#ffffff" }}></i>Sair
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </aside>

                <main className="main-content">
                    {children}
                </main>
            </div>
        </header>
    );
}