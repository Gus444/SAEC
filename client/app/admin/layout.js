'use client'
import jwt_decode from 'jwt-decode'
import { useContext, useEffect, useState } from "react"
import Link from "next/link";

export default function adminPage({children}){

    return(
        <header>
         <div className="layout">
            <aside className="sidebar">
                <ul>
                    <img src="/img/logotipo primus.png" className="img-format"></img>
                    <hr></hr>
                    <li><a href="/admin">Home</a></li>
                    <li><a href="/admin/usuarios">Usuarios</a></li>
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