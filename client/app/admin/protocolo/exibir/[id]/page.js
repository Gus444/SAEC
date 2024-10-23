'use client'
import { useEffect, useState } from "react";

export default function ExibirProtocolo({ params: { id } }) {
    let [protocolo, setProtocolo] = useState(null);
    let [docs, setDocs] = useState(null);
    let [loading, setLoading] = useState(true);
    const PROTOCOLO_IMG_CAMINHO = "http://localhost:5000/img/Protocolo/";

    // Fazer ambas as requisições ao mesmo tempo com Promise.all
    function carregarDados(id) {
        Promise.all([
            fetch(`http://localhost:5000/protocolo/obter/${id}`, {
                mode: 'cors',
                credentials: "include",
                method: "GET",
            }),
            fetch(`http://localhost:5000/docsProtocolo/obter/${id}`, {
                mode: 'cors',
                credentials: "include",
                method: "GET"
            })
        ])
        .then(async ([resProtocolo, resDocs]) => {
            const protocoloData = await resProtocolo.json();
            const docsData = await resDocs.json();
            console.log(protocoloData);
            console.log(docsData);
            
            setProtocolo(protocoloData);
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

    console.log("Caminho da imagem:", PROTOCOLO_IMG_CAMINHO);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Resumo do Protocolo Cadastrada</h2>
            <table className="table table-bordered mt-4">
                <tbody>
                    <tr>
                        <th>Título</th>
                        <td>{protocolo.protTitulo || "Título da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Canal</th>
                        <td>{protocolo.protTipo || "Canal da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Data</th>
                        <td>{protocolo.protData || "Data da Comunicação"}</td>
                    </tr>
                    <tr>
                        <th>Descrição</th>
                        <td>{protocolo.protDescricao || "Descrição da Comunicação"}</td>
                    </tr>
                </tbody>
            </table>

            <h3 className="mt-5">Documentos Relacionados</h3>
            <table className="table table-bordered mt-4">
                <tbody>
                    <tr>
                        <th>ID do Documento</th>
                        <td>{docs?.protDocsId || "Não possui registro"}</td>
                    </tr>
                    <tr>
                        <th>Documento</th>
                        <td>
                        <a 
                            href={`${PROTOCOLO_IMG_CAMINHO}${docs?.protDocsNome || "Não há registro"}`} 
                            download={docs?.protDocsNome || "Não possui registro"} // Define o nome do arquivo a ser baixado
                            style={{ textDecoration: 'none' }} // Remover sublinhado do link
                            >
                                <img 
                                    src={`${PROTOCOLO_IMG_CAMINHO}${docs?.protDocsNome}` || "Não há registro"} 
                                    alt={docs? "Documento" : "Não possui registro"}
                                    style={{ maxWidth: '100%', height: 'auto' }} 
                                />
                        </a>
                        </td>
                    </tr>
                    <tr>
                        <th>ID da Comunicação</th>
                        <td>{docs?.protocoloId || ""}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}