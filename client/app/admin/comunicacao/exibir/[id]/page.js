'use client'
import { useEffect, useState } from "react";

export default function ExibirComunicacao({ params: { id } }) {
    let [comunicacao, setComunicacao] = useState(null);
    let [docs, setDocs] = useState(null);
    let [loading, setLoading] = useState(true);
    const COMUNICACAO_IMG_CAMINHO = "http://localhost:5000/img/Comunicacao/";

    // Fazer ambas as requisições ao mesmo tempo com Promise.all
    function carregarDados(id) {
        Promise.all([
            fetch(`http://localhost:5000/comunicacao/obter/${id}`, {
                mode: 'cors',
                credentials: "include",
                method: "GET",
            }),
            fetch(`http://localhost:5000/docsComunicacao/obter/${id}`, {
                mode: 'cors',
                credentials: "include",
                method: "GET"
            })
        ])
        .then(async ([resComunicacao, resDocs]) => {
            const comunicacaoData = await resComunicacao.json();
            const docsData = await resDocs.json();
            console.log(comunicacaoData);
            console.log(docsData);
            
            setComunicacao(comunicacaoData);
            setDocs(docsData.docsEncontrados); // Acesse docsEncontrados diretamente
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao carregar os dados:", err);
            setLoading(false);
        });
    }

    useEffect(() => {
        carregarDados(id);
    }, [id]);

    if (loading) {
        return (
            <div className="container mt-5">
                <h2 className="text-center">Carregando...</h2>
            </div>
        );
    }

    
    console.log("Caminho da imagem:", COMUNICACAO_IMG_CAMINHO);

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
                </tbody>
            </table>
    
            <h3 className="mt-5">Documentos Relacionados</h3>
            <table className="table table-bordered mt-4">
                <tbody>
                    {docs && docs.length > 0 ? (
                        docs.map((doc, index) => (
                            <tr key={index}>
                                <th>Documento {index + 1}</th>
                                <td>
                                    <a 
                                        
                                        href={`${COMUNICACAO_IMG_CAMINHO}${doc.comDocsNome}`} 
                                        download={doc.comDocsNome} 
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <img 
                                            src={`${COMUNICACAO_IMG_CAMINHO}${doc.comDocsNome}`} 
                                            alt={`Documento ${index + 1}`} 
                                            style={{ maxWidth: '100%', height: 'auto' }} 
                                        />
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">Não há documentos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}