'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";
import { useRouter } from "next/navigation";

export default function comunicacaoAdmin() {

    let msgRef = useRef(null)
    let { emp, setEmp } = useContext(EmpContext)
    let [listaProtocolo, setListaProtocolo] = useState([]);
    const [loading, setLoading] = useState(true);
    let [query, setQuery] = useState("");
    let [filteredProtocolo, setFilteredProtocolo] = useState([]);  // Estado para a lista filtrada
    const [filtro, setFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState(''); // '' significa "sem filtro"

    let timeoutId;
    useEffect(() => {
        carregarProtocolo();

        // Limpa o timeout quando o componente desmonta
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    const router = useRouter();

    useEffect(() => {
        // Verifica se a empresa está selecionada
        if (!emp) {
            // Redireciona para a página de empresas se nenhuma empresa estiver selecionada
            router.push("/admin/empresas");
        } else {
            setLoading(false);
        }
    }, [emp, router]);

    useEffect(() => {
        if (listaProtocolo.length > 0) {
            buscarProtocolo(); // Aplica os filtros sempre que o filtro de tipo mudar
        }
    }, [tipoFiltro]); // Dependência para reagir a alterações no filtro de tipo

    function carregarProtocolo() {
        fetch(`http://localhost:5000/protocolo/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r => r.json())
        .then(r => {
            setListaProtocolo(r); // Atualiza a lista principal
            setFilteredProtocolo(r); // Inicializa a lista filtrada
        });
    }

    async function excluirProtocolo(id) {
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';

        if (confirm("Tem certeza que deseja excluir este registro?")) {
            if (id > 0) {
                let ok = false;
                fetch(`http://localhost:5000/protocolo/excluir/${id}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "DELETE",
                })
                .then(r => {
                    ok = r.status == 200;
                    return r.json();
                })
                .then(r => {
                    if (ok) {
                        msgRef.current.className = "msgSucess";
                        msgRef.current.innerHTML = r.msg;
                        carregarProtocolo();

                        timeoutId = setTimeout(() => {
                            if (msgRef.current) {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }
                        }, 5000);
                    } else {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = r.msg;

                        timeoutId = setTimeout(() => {
                            if (msgRef.current) {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }
                        }, 5000);
                    }
                });
            }
        }
    }

    function aplicarFiltroDeOrdenacao(protocolos) {
        let protocolosOrdenados = [...protocolos]; // Cria uma cópia da lista para evitar mutações diretas
    
        if (filtro === 'codigoCrescente') {
            protocolosOrdenados.sort((a, b) => a.protId - b.protId); // Ordenar por ID crescente
        } else if (filtro === 'codigoDecrescente') {
            protocolosOrdenados.sort((a, b) => b.protId - a.protId); // Ordenar por ID decrescente
        } else if (filtro === 'nomeA-Z') {
            protocolosOrdenados.sort((a, b) => a.protTitulo.localeCompare(b.protTitulo)); // Ordenar por título crescente
        } else if (filtro === 'nomeZ-A') {
            protocolosOrdenados.sort((a, b) => b.protTitulo.localeCompare(a.protTitulo)); // Ordenar por título decrescente
        }
    
        return protocolosOrdenados;
    }
    
    function buscarProtocolo() {
        let protocolosFiltrados = listaProtocolo.filter(protocolo => {
            const correspondeBusca = protocolo.protTitulo.toLowerCase().includes(query.toLowerCase());
            const correspondeTipo = tipoFiltro === '' || protocolo.protTipo === tipoFiltro;
    
            return correspondeBusca && correspondeTipo; // Deve satisfazer ambos os filtros
        });
    
        setFilteredProtocolo(aplicarFiltroDeOrdenacao(protocolosFiltrados)); // Ordena e atualiza
    }

    const prepararRelatorio = () => {// relatorio de usuarios
        // Usa `usuariosExibidos` em vez de `listaUsuarios`

        const filtrosAplicados = `
        <div style="text-align: center; margin-top: 20px; font-family: Arial, sans-serif; font-size: 14px;">
            <strong>Filtros Aplicados:</strong>
            ${filtro ? `<p><strong>Filtro de Ordenação:</strong> ${filtro}</p>` : 'Nenhum'}
            ${tipoFiltro ? `<p><strong>Filtro de Tipo:</strong> ${tipoFiltro}</p>` : ''}
        </div>
         `;

        const conteudoImpressao = document.createElement("div");
        conteudoImpressao.innerHTML = `
            <img src="/img/logotipo primus.png" style="display: block; margin: 0 auto; width: 200px; height: auto;"></img>
            <h1>Relatório de Protocolos</h1>
            </br>
            <h3>Empresa: ${emp.empNome}</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 8px;">Código</th>
                        <th style="border: 1px solid black; padding: 8px;">Titulo</th>
                        <th style="border: 1px solid black; padding: 8px;">Tipo</th>
                        <th style="border: 1px solid black; padding: 8px;">Data</th>
                    </tr>
                </thead>
                <tbody>
                ${filtrosAplicados}
                    ${filteredProtocolo.map(protocolo => `
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">${protocolo.protId}</td>
                            <td style="border: 1px solid black; padding: 8px;">${protocolo.protTitulo}</td>
                            <td style="border: 1px solid black; padding: 8px;">${protocolo.protTipo}</td>
                            <td style="border: 1px solid black; padding: 8px;">${protocolo.protData}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    
        // Salva o conteúdo original da página
        const originalContents = document.body.innerHTML;
    
        // Substitui o conteúdo do `body` pelo conteúdo de impressão e imprime
        document.body.innerHTML = conteudoImpressao.innerHTML;
        window.print();
    
        // Restaura o conteúdo original
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    console.log(filteredProtocolo)

    return (
        <div>
            <h1>Lista de protocolos</h1>
            <div>
                <Link href="/admin/protocolo/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar protocolo</Link>
                <button className="btn btn-primary" style={{marginBottom: "15px", marginLeft: "5px"}} onClick={prepararRelatorio}>Salvar PDF</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="form-floating mb-3" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            className='form-control'
                            style={{ width: '500px' }} // Ajuste a largura do input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    buscarProtocolo(); // Busca quando Enter é pressionado
                                }
                            }}
                        />
                        <label htmlFor="floatingInput">Buscar</label>
                    </div>

                    {/* filtro para nome e codigo */}
                    <select
                        className="form-select"
                        style={{ width: '200px', marginRight: '10px' }}
                        value={filtro}
                        onChange={(e) => {
                            setFiltro(e.target.value); // Atualiza o filtro
                            buscarProtocolo(); // Aplica o novo filtro
                        }}
                    >
                        <option value="">Escolha um filtro</option>
                        <option value="codigoCrescente">Código (Crescente)</option>
                        <option value="codigoDecrescente">Código (Decrescente)</option>
                        <option value="nomeA-Z">Nome (A-Z)</option>
                        <option value="nomeZ-A">Nome (Z-A)</option>
                    </select>

                    {/* filtro para documentos recebidos e entregues */}
                    <select
                        className="form-select"
                        style={{ width: '200px', marginRight: '10px' }}
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)} // Atualiza o estado do filtro de tipo
                    >
                        <option value="">Todos os Tipos</option>
                        <option value="Recebido">Recebido</option>
                        <option value="Entregue">Entregue</option>
                    </select>
                    <button onClick={buscarProtocolo} className="btn btn-primary" style={{ width: '100px' }}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>

            <div ref={msgRef}>

            </div>

            <div>
                <MontaTabela alteracao={"/admin/protocolo/alteracao"}  exclusao={excluirProtocolo} exibir={"/admin/protocolo/exibir"} lista={filteredProtocolo} cabecalhos={["Código","Titulo", "Tipo", "Data", "Usuario", "Empresa"]} propriedades={['protId', 'protTitulo', 'protTipo', 'protData', "usuario.usuNome", "empresa.empNome"]} ></MontaTabela>
            </div>
        </div>
    )
}