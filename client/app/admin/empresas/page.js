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
    useEffect((e) => {
        carregarEmpresas();
    }, [])

    function carregarEmpresas() {
        fetch("http://localhost:5000/empresa", {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r => r.json())
        .then(r => {
            console.log("Dados carregados:", r); // Verifique os dados aqui
            setListaEmpresas(r);
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
                        }));
    
                        setListaEmpresas(mappedData);
                    }
                } else {
                    // Caso não seja um array, você pode exibir uma mensagem de erro
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = "Sem resultado.";
                    setListaEmpresas([]); // Limpa a lista em caso de erro
                    setTimeout(() => {
                        msgRef.current.innerHTML = '';
                        msgRef.current.className = '';
                    }, 2000);
                }
            })
            .catch(err => {
                // Tratamento de erro da requisição
                console.error("Erro ao buscar empresas:", err);
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Sem resultado.";
                setListaEmpresas([]); // Limpa a lista em caso de erro
                setTimeout(() => {
                    msgRef.current.innerHTML = '';
                    msgRef.current.className = '';
                }, 2000);
            });
        } else {
            carregarEmpresas();
        }
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
    
                        setTimeout(() => {
                            msgRef.current.innerHTML = '';
                            msgRef.current.className = '';
                        }, 5000);
                    } else {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = r.msg;
    
                        setTimeout(() => {
                            msgRef.current.innerHTML = '';
                            msgRef.current.className = '';
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

    return (
        <div>
            <h1>Empresas cadastradas</h1>
            <div>
                <Link href="/admin/empresas/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar empresa</Link>
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
                <button onClick={buscarEmpresas} className="btn btn-primary" style={{ width: '100px' }}><i className="fa-solid fa-magnifying-glass"></i></button> {/* Ajuste a largura do botão */}
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaEmpresa alteracao={"/admin/empresas/alteracao"}  exclusao={excluirEmpresa} acesso={acessarEmpresa} exibir={"/admin/empresas/exibir"} lista={listaEmpresas} cabecalhos={["id","Empresa", "CNPJ", "Regime", "Email", "Telefone"]} propriedades={["empId" ,'empNome', 'empCnpj', 'empRegime', 'empEmail', 'empTelefone']} ></MontaTabelaEmpresa>
            </div>
        </div>
    )
}