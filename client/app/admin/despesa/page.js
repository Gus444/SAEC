'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import { useRouter } from "next/navigation";
import MontaTabelaAnos from "@/app/components/montaTabelaAnos";

export default function despesaAdmin(){

    let msgRef = useRef(null);

    let {emp, setEmp} = useContext(EmpContext)
    let [listaAnos, setListaAnos] = useState([]);
    const [loading, setLoading] = useState(true);
    let timeoutId;
    let [query, setQuery] = useState("");
    let [filteredDespesa, setFilteredDespesa] = useState([]);  // Estado para a lista filtrada
    const [filtro, setFiltro] = useState('');

    useEffect((e) => {
        carregarAnos();
    }, [])
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

    function carregarAnos() {
        fetch(`http://localhost:5000/controleDespesa/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r => r.json())
        .then(r => {
            const listaAnosComPrefixo = r.map(item => ({
                ...item,
                totalDespesa: `R$ ${item.totalDespesa.toFixed(2).replace('.', ',')}`, // Formata o valor
            }));
            setListaAnos(listaAnosComPrefixo);
            setFilteredDespesa(listaAnosComPrefixo);
        });
    }

    async function excluirDespesa(id) {
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (confirm("Tem certeza que deseja excluir este período? ATENÇÃO VOCE ESTA PRESTES A APAGAR TODOS OS LANÇAMENTOS DE FEITOS NESTE ANO")) {
    
            if (id) {
                let ok = false;
    
                fetch(`http://localhost:5000/controleDespesa/excluirAno/${id}/${emp.empId}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: "DELETE",
                })
                .then(r => {
                    ok = r.status === 200;
                    return r.json();
                })
                .then(r => {
                    if (ok) {
                        msgRef.current.className = "msgSucess";
                        msgRef.current.innerHTML = r.msg;
                        carregarAnos();
    
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
            } else {
                console.error("Ano ou ID da empresa ausente.");
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Não foi possível excluir o período: informações ausentes.";
            }
        }
    }

    const prepararRelatorio = () => {// relatorio de usuarios
        // Usa `usuariosExibidos` em vez de `listaUsuarios`
        const conteudoImpressao = document.createElement("div");
        conteudoImpressao.innerHTML = `
            <img src="/img/logotipo primus.png" style="display: block; margin: 0 auto; width: 200px; height: auto;"></img>
            <h1>Relatório de Despesa</h1>
            </br>
            <h3>Empresa: ${emp.empNome}</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 8px;">Ano</th>
                        <th style="border: 1px solid black; padding: 8px;">Total Despesa</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredDespesa.map(despesa => `
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">${despesa.ano}</td>
                            <td style="border: 1px solid black; padding: 8px;">${despesa.totalDespesa}</td>
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

    function aplicarFiltroDeOrdenacao(despesa) {
        let despesaOrdenada = [...despesa]; // Cria uma cópia da lista para evitar mutações diretas
    
        if (filtro === 'codigoAsc') {
            despesaOrdenada.sort((a, b) => a.ano - b.ano); // Ordenar por ID crescente
        } else if (filtro === 'codigoDesc') {
            despesaOrdenada.sort((a, b) => b.ano - a.ano); // Ordenar por ID decrescente
        }
    
        return despesaOrdenada;
    }
    

    function buscarDespesa() {
        let despesaFiltrada = listaAnos.filter(despesa => {
            return despesa.ano.toString().includes(query.toLowerCase());
        });
    
        setFilteredDespesa(aplicarFiltroDeOrdenacao(despesaFiltrada));
    }

    console.log(listaAnos)

    return (
        <div>
            <div style={{display: 'flex'}}>
                <h1>Lista de Anos Despesa</h1>
                <Link href="/admin/despesa/ajudaDespesa" className="btn btn-link ms-2">
                        <i className="fas fa-circle-info fa-2x"></i>
                </Link>
            </div>
            
            
            <div>
                <Link href="/admin/despesa/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar Despesa</Link>
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
                                    buscarDespesa(); // Busca quando Enter é pressionado
                                }
                            }}
                        />
                        <label htmlFor="floatingInput">Buscar</label>
                    </div>

                    {/* filtro para ano */}
                    <select
                        className="form-select"
                        style={{ width: '200px', marginRight: '10px' }}
                        value={filtro}
                        onChange={(e) => {
                            setFiltro(e.target.value); // Atualiza o filtro
                            buscarDespesa(); // Aplica o novo filtro
                        }}
                    >
                        <option value="">Escolha um filtro</option>
                        <option value="codigoAsc">Ano Crescente</option>
                        <option value="codigoDesc">Ano Decrescente</option>
                    </select>
                    <button onClick={buscarDespesa} className="btn btn-primary" style={{ width: '100px' }}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>

            <div ref={msgRef}>

            </div>

            <div>
                <MontaTabelaAnos alteracao={"/admin/despesa/alteracao"}  exclusao={excluirDespesa} lista={filteredDespesa} cabecalhos={["Ano","Valor Total"]} propriedades={["ano", "totalDespesa"]} campoExclusao="ano" ></MontaTabelaAnos>
            </div>
        </div>
    )
}
