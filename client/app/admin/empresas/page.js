'use client'
import MontaTabelaEmpresa from '@/app/components/montaTabelaEmpresa.js'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';

export default function empresasAdmin() {

    let msgRef = useRef(null)

    let {emp, setEmp} = useContext(EmpContext)
    let empresaLogada
    let [listaEmpresas, setListaEmpresas] = useState([]);
    const [query, setQuery] = useState("");
    const [exibirComDataFim, setExibirComDataFim] = useState(false); // Estado para o checkbox
    const [filtro, setFiltro] = useState('');

    let empresasExibidas = listaEmpresas.filter(empresa => {
        let queryMatch = query === "" || empresa.empNome.toLowerCase().includes(query.toLowerCase());
        return queryMatch;
    });

    let timeoutId
    useEffect(() => {
        carregarEmpresas();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [exibirComDataFim]); // Recarregar quando o checkbox muda

    function carregarEmpresas() {
        fetch("http://localhost:5000/empresa", {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r => r.json())
        .then(r => {
            console.log("Dados carregados:", r);

            // Filtrar empresas para ocultar as que possuem `empFim` quando `exibirComDataFim` é falso
            const empresasFiltradas = r.filter(item => exibirComDataFim || !item.empFim);

            // Aplicar o filtro de ordenação baseado na variável 'filtro'
            const empresasOrdenadas = aplicarFiltroDeOrdenacao(empresasFiltradas);

            setListaEmpresas(empresasOrdenadas);
        });
    }

    function buscarEmpresas() {
        if (query.trim() !== "") {
            fetch(`http://localhost:5000/empresa/buscar?query=${encodeURIComponent(query)}`, {
                mode: 'cors',
                credentials: 'include',
                method: "GET",
            })
            .then(r => r.json())
            .then(r => {
                console.log("Dados retornados da busca:", r); // Verifique os dados aqui
                
                // Verifica se a resposta é um array
                if (Array.isArray(r)) {
                    if (r.length === 0) {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = "Nenhuma empresa encontrada.";
                        setListaEmpresas([]); // Limpa a lista se não houver resultados
                        setTimeout(() => {
                            msgRef.current.innerHTML = '';
                            msgRef.current.className = '';
                        }, 3000);
                    } else {
                        // Mapeia os dados para os novos nomes
                        const mappedData = r.map(item => ({
                            empId: item.emp_id,
                            empNome: item.emp_nome,
                            empCnpj: item.emp_cnpj,
                            empRegime: item.emp_regime,
                            empEmail: item.emp_email,
                            empTelefone: item.emp_telefone,
                            empIe: item.emp_ie,
                            empResponsavel: item.emp_responsavel,
                            empProprietario: item.emp_proprietario,
                            empInicio: item.emp_inicio,
                            empFim: item.emp_fim,
                        }));
    
                        setListaEmpresas(mappedData);
                    }
                } else {
                    // Caso não seja um array, você pode exibir uma mensagem de erro
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = "Sem resultado.";
                    setListaEmpresas([]); // Limpa a lista em caso de erro
                    timeoutId = setTimeout(() => {
                        if (msgRef.current) {
                            msgRef.current.innerHTML = '';
                            msgRef.current.className = '';
                        }
                    }, 5000);
                }
            })
            .catch(err => {
                // Tratamento de erro da requisição
                console.error("Erro ao buscar empresas:", err);
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Sem resultado.";
                setListaEmpresas([]); // Limpa a lista em caso de erro
                timeoutId = setTimeout(() => {
                    if (msgRef.current) {
                        msgRef.current.innerHTML = '';
                        msgRef.current.className = '';
                    }
                }, 5000);
            });
        } else {
            carregarEmpresas();
        }
    }

    function aplicarFiltroDeOrdenacao(empresas) {
        if (filtro === 'codigoAsc') {
            return empresas.sort((a, b) => a.empId - b.empId); // Ordenar por ID crescente
        } else if (filtro === 'codigoDesc') {
            return empresas.sort((a, b) => b.empId - a.empId); // Ordenar por ID decrescente
        } else if (filtro === 'nomeAsc') {
            return empresas.sort((a, b) => a.empNome.localeCompare(b.empNome)); // Ordenar por nome crescente
        } else if (filtro === 'nomeDesc') {
            return empresas.sort((a, b) => b.empNome.localeCompare(a.empNome)); // Ordenar por nome decrescente
        }
        
        return empresas; // Caso nenhum filtro seja selecionado, retorna a lista original
   }

    async function excluirEmpresa(id) {
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (emp && emp.empId) {
            let empresa = await fetch(`http://localhost:5000/empresa/obter/${id}`, {
                mode: 'cors',
                credentials: 'include',
                method: "GET",
            });
            let dados = await empresa.json();
            empresaLogada = dados.empId;
    
            if (emp.empId !== empresaLogada) {
                executarExclusao(id);
            } else {
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = 'Não é possível apagar a empresa em que está logado';
            }
        } else {
            executarExclusao(id);
        }
    }
    
    function executarExclusao(id) {
        if (confirm("Tem certeza que deseja excluir esta empresa?")) {
            if (id > 0) {
                let ok = false;
                fetch(`http://localhost:5000/empresa/excluir/${id}`, {
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
                        carregarEmpresas();
    
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

    function acessarEmpresa(id){

        if(id>0){
            let ok = false
            fetch(`http://localhost:5000/empresa/obterAcesso/${id}`, {
                mode: 'cors',
                credentials: 'include',
                method: 'GET',
                headers:{
                    "Content-type": "application/json",
                }
            }).then(resposta =>{
                ok = resposta.status == 200;
                return resposta.json();
            }).then(resposta =>{
                if(ok){
                    console.log(resposta.empresaEncontrada);
                    setEmp(resposta.empresaEncontrada);
                    localStorage.setItem("empresa", JSON.stringify(resposta.empresaEncontrada));

                    msgRef.current.className = "msgSucess";
                    msgRef.current.innerHTML = `Voce acessou a empresa: ${resposta.empresaEncontrada.empNome}`;
                }
                else{
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = resposta.msg;
                }
            })
        }
        else{
            msgRef.current.className = 'msgError'
            msgRef.current.innerHTML = 'Erro ao acessar'
        }
    }

    const prepararRelatorio = () => {// relatorio de usuarios
        // Usa `usuariosExibidos` em vez de `listaUsuarios`

        const filtrosAplicados = `
        <div style="text-align: center; margin-top: 20px; font-family: Arial, sans-serif; font-size: 14px;">
            <strong>Filtros Aplicados:</strong>
            ${exibirComDataFim ? `<p><strong>Filtro Adicional:</strong> Empresas com Fim de Contrato incluídas</p>` : ''}
            ${filtro ? `<p><strong>Filtro de Ordenação:</strong> ${filtro}</p>` : ''}
        </div>
         `;

        const conteudoImpressao = document.createElement("div");
        conteudoImpressao.innerHTML = `
        <img src="/img/logotipo primus.png" style="display: block; margin: 0 auto; width: 200px; height: auto;"></img>
        <h1 style="text-align: center;">Relatório de Empresas</h1>
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            ${filtrosAplicados}
            ${empresasExibidas.map(empresa => `
                <div style="border: 1px solid black; margin-bottom: 20px; padding: 10px; border-radius: 8px;">
                    <h2 style="margin: 0; text-align: center;">***** ${empresa.empNome} *****</h2>
                    <p><strong>CNPJ:</strong> ${empresa.empCnpj}</p>
                    <p><strong>Regime:</strong> ${empresa.empRegime}</p>
                    <p><strong>IE:</strong> ${empresa.empIe}</p>
                    <p><strong>Telefone:</strong> ${empresa.empTelefone}</p>
                    <p><strong>Responsável:</strong> ${empresa.empResponsavel}</p>
                    <p><strong>Proprietário:</strong> ${empresa.empProprietario}</p>
                    <p><strong>Início:</strong> ${empresa.empInicio}</p>
                    <p><strong>Fim:</strong> ${empresa.empFim}</p>
                    <p><strong>Email:</strong> ${empresa.empEmail}</p>
                </div>
            `).join('')}
        </div>
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
            <h1>Empresas cadastradas</h1>
            <div>
                <Link href="/admin/empresas/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar empresa</Link>
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
                                buscarEmpresas(); // Busca quando Enter é pressionado
                            }
                        }}
                    />
                    <label htmlFor="floatingInput">Buscar</label>
            </div>
                <select
                    className="form-select"
                    style={{ width: '200px', marginRight: '10px' }}
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)} // Atualiza o filtro
                >
                    <option value="">Escolha um filtro</option>
                    <option value="codigoAsc">Código (Crescente)</option>
                    <option value="codigoDesc">Código (Decrescente)</option>
                    <option value="nomeAsc">Nome (A-Z)</option>
                    <option value="nomeDesc">Nome (Z-A)</option>
                </select>
                <button onClick={buscarEmpresas} className="btn btn-primary" style={{ width: '100px' }}><i className="fa-solid fa-magnifying-glass"></i></button> {/* Ajuste a largura do botão */}
                
            </div>

            <div style={{ marginTop: '15px' }}>
                <input
                    type="checkbox"
                    checked={exibirComDataFim}
                    onChange={() => setExibirComDataFim(!exibirComDataFim)}
                />
                <label style={{ marginLeft: '8px' }}>Exibir empresas com fim de contrato</label>
            </div>

            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaEmpresa alteracao={"/admin/empresas/alteracao"}  exclusao={excluirEmpresa} acesso={acessarEmpresa} exibir={"/admin/empresas/exibir"} lista={listaEmpresas} cabecalhos={["id","Empresa", "CNPJ", "Regime", "Email", "Telefone"]} propriedades={["empId" ,'empNome', 'empCnpj', 'empRegime', 'empEmail', 'empTelefone']} ></MontaTabelaEmpresa>
            </div>
        </div>
    )
}