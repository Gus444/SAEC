'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExibirComunicacao({ params: { id } }) {

    let [comunicacao, setComunicacao] = useState(null);

    function carregarComunicacao(id) {
        fetch(`http://localhost:5000/comunicacao/obter/${id}`, {
            credentials: "include"
        })
        .then(r => r.json())
        .then(r => {
            console.log(r);
            setComunicacao(r);
        })
        .catch(err => console.error("Erro ao carregar comunicação:", err));
    }

    useEffect(() => {
        carregarComunicacao(id);
    }, [id]);

    console.log(comunicacao)
    // Verifique se a comunicação já foi carregada
    if (!comunicacao) {
        return (
            <div className="container mt-5">
                <h2 className="text-center">Carregando...</h2>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center">Resumo da Comunicação Cadastrada</h2>
            <table className="table table-bordered mt-4">
                <tbody>
                    <tr>
                        <th>Título</th>
                        <td>{comunicacao.comTitulo || "Título da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Canal</th>
                        <td>{comunicacao.comCanal || "Canal da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Data</th>
                        <td>{comunicacao.comData || "Data da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Hora</th>
                        <td>{comunicacao.comHora || "Hora da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Descrição</th>
                        <td>{comunicacao.comDescricao || "Descrição da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Usuário</th>
                        <td>{comunicacao.usuario || "Nome do Usuário"}</td>
                    </tr>
                    <tr>
                        <th>Empresa</th>
                        <td>{comunicacao.empresa || "Nome da Empresa"}</td>
                    </tr>
                </tbody>
            </table>
            <div className="text-center">
                <Link href="/admin/comunicacao" className="btn btn-outline-secondary">Voltar</Link>
            </div>
        </div>
    );
}