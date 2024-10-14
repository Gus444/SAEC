'use client'
import { useContext, useEffect, useState } from "react"
import Link from "next/link";
import UserContext from "../context/userContext.js"
import Loading from "../components/loading.js";

export default function adminPage({children}){

    
    const {user, setUser} = useContext(UserContext);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        setIsClient(true);
        setLoading(false);
    }, []);

    
    const isAdmin = user && user.usuNivel === 0;
    if (loading) {
        return <Loading></Loading>
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
                    <hr></hr>
                    <li><a href="/admin">Home</a></li>
                    {isAdmin && <li><Link href="/admin/usuarios">Usuarios</Link></li>}
                    <li><a href="/admin/empresas">Empresas</a></li>
                </ul>
            </aside>

            <main className="main-content">
                {children}
            </main>
         </div>
        </header>
    )
}