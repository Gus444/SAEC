'use client'
import { useEffect, useState } from "react";


export default function ExibirUsuario({ params: { id } }) {
 
    let [usuario, setUsuario] = useState([]);

    useEffect((e) => {
        carregarUsuario();
    }, [])

    function carregarUsuario() {
        fetch(`http://localhost:5000/usuarios/obter/${id}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setUsuario(r);
        })
    }


    return (
        <div className="container mt-5">
            <h2 className="text-center">Registro de usuario</h2>
            <table className="table table-bordered mt-4">
                <tbody>
                    <tr>
                        <th>Identificador</th>
                        <td>{usuario.usuId || "Título da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <td>{usuario.usuNome || "Canal da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Telefone</th>
                        <td>{usuario.usuTelefone || "Data da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{usuario.usuEmail || "Hora da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Senha</th>
                        <td>{usuario.usuSenha || "Descrição da Comunicação"}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}