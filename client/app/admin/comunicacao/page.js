'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";
import { useRouter } from "next/navigation";

export default function comunicacaoAdmin(){

    const router = useRouter();
    let msgRef = useRef(null)

    let {emp, setEmp} = useContext(EmpContext)
    let [listaComunicacao, setListaComunicacao] = useState([]);
    const [loading, setLoading] = useState(true);
    let [query, setQuery] = useState("");
    let [filteredComunicacao, setFilteredComunicacao] = useState([]);  // Estado para a lista filtrada
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        buscarComunicacao();
    }, [filtro]);

    let timeoutId
    useEffect(() => {
        carregarComunicacao();

        // Limpa o timeout quando o componente desmonta
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        // Verifica se a empresa está selecionada
        if (!emp) {
            // Redireciona para a página de empresas se nenhuma empresa estiver selecionada
            router.push("/admin/empresas");
        } else {
            setLoading(false);
        }
    }, [emp, router]);

    function carregarComunicacao() {
        fetch(`http://localhost:5000/comunicacao/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaComunicacao(r); // Atualiza a lista principal
            setFilteredComunicacao(r); // Inicializa a lista filtrada
        })
    }

    async function excluirComunicacao(id){

        msgRef.current.className = ''
        msgRef.current.innerHTML = ''

            if(confirm("Tem certeza que deseja excluir este registro?")) {
                if(id > 0) {
                    let ok = false;
                    fetch(`http://localhost:5000/comunicacao/excluir/${id}`, {
                        mode: 'cors',
                        credentials: 'include',
                        method: "DELETE",
                    })
                    .then(r=> {
                        ok = r.status == 200;
                        return r.json();
                    })
                    .then(r=> {
                        if(ok) {
                            msgRef.current.className = "msgSucess";
                            msgRef.current.innerHTML = r.msg;
                            carregarComunicacao();

                            timeoutId = setTimeout(() => {
                                if (msgRef.current) {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }
                            }, 5000);
                        }
                        else{
                            msgRef.current.className = "msgError";
                            msgRef.current.innerHTML = r.msg;

                            timeoutId = setTimeout(() => {
                                if (msgRef.current) {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }
                            }, 5000);
                        }
                    })
                }
            }  
    }    

    function aplicarFiltroDeOrdenacao(comunicacao) {
        let comunicacaoOrdenada = [...comunicacao]; // Cria uma cópia da lista para evitar mutações diretas
    
        if (filtro === 'codigoAsc') {
            comunicacaoOrdenada.sort((a, b) => a.comId - b.comId); // Ordenar por ID crescente
        } else if (filtro === 'codigoDesc') {
            comunicacaoOrdenada.sort((a, b) => b.comId - a.comId); // Ordenar por ID decrescente
        } else if (filtro === 'nomeAsc') {
            comunicacaoOrdenada.sort((a, b) => a.comTitulo.localeCompare(b.comTitulo)); // Ordenar por título crescente
        } else if (filtro === 'nomeDesc') {
            comunicacaoOrdenada.sort((a, b) => b.comTitulo.localeCompare(a.comTitulo)); // Ordenar por título decrescente
        }
    
        return comunicacaoOrdenada;
    }
    
    function buscarComunicacao() {
        let comunicacoesFiltradas = listaComunicacao.filter(comunicacao => {
            return comunicacao.comTitulo.toLowerCase().includes(query.toLowerCase());
        });
    
        setFilteredComunicacao(aplicarFiltroDeOrdenacao(comunicacoesFiltradas));
    }

    const prepararRelatorio = () => {// relatorio de usuarios
        // Usa `usuariosExibidos` em vez de `listaUsuarios`
        const conteudoImpressao = document.createElement("div");
        conteudoImpressao.innerHTML = `
            <img src="/img/logotipo primus.png" style="display: block; margin: 0 auto; width: 200px; height: auto;"></img>
            <h1>Relatório de Comunicação</h1>
            </br>
            <h3>Empresa: ${emp.empNome}</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 8px;">Código</th>
                        <th style="border: 1px solid black; padding: 8px;">Titulo</th>
                        <th style="border: 1px solid black; padding: 8px;">Data</th>
                        <th style="border: 1px solid black; padding: 8px;">Hora</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredComunicacao.map(comunicacao => `
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">${comunicacao.comId}</td>
                            <td style="border: 1px solid black; padding: 8px;">${comunicacao.comTitulo}</td>
                            <td style="border: 1px solid black; padding: 8px;">${comunicacao.comData}</td>
                            <td style="border: 1px solid black; padding: 8px;">${comunicacao.comHora}</td>
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

    return (
        <div>
            <h1>Lista de comunicação</h1>
            <div>
                <Link href="/admin/comunicacao/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar comunicação</Link>
                <button className="btn btn-primary" style={{marginBottom: "15px", marginLeft: "5px"}} onClick={prepararRelatorio}>Salvar PDF</button>
            </div>
            <div ref={msgRef}>

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
                                    buscarComunicacao(); // Busca quando Enter é pressionado
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
                            buscarComunicacao(); // Aplica o novo filtro
                        }}
                    >
                        <option value="">Escolha um filtro</option>
                        <option value="codigoAsc">Código (Crescente)</option>
                        <option value="codigoDesc">Código (Decrescente)</option>
                        <option value="nomeAsc">Nome (A-Z)</option>
                        <option value="nomeDesc">Nome (Z-A)</option>
                    </select>
                    <button onClick={buscarComunicacao} className="btn btn-primary" style={{ width: '100px' }}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>        

            <div>
                <MontaTabela alteracao={"/admin/comunicacao/alteracao"}  exclusao={excluirComunicacao} exibir={"/admin/comunicacao/exibir"} lista={filteredComunicacao} cabecalhos={["id","Titulo", "Canal", "Data", "Hora", "Usuario", "Empresa"]} propriedades={['comId', 'comTitulo', 'comCanal', 'comData', 'comHora', "usuario.usuNome", "empresa.empNome"]} ></MontaTabela>
            </div>
        </div>
    )
}