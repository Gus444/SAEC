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
    useEffect((e) => {
        carregarEmpresas();
    }, [])

    function carregarEmpresas() {
        fetch("http://localhost:5000/empresa", {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaEmpresas(r);
        })
    }

    async function excluirEmpresa(id){

        msgRef.current.className = ''
        msgRef.current.innerHTML = ''

        let empresa = await fetch(`http://localhost:5000/empresa/obter/${id}`,{
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        });
        let dados = await empresa.json();
        empresaLogada = dados.empId

            if(emp.empId != empresaLogada){
                if(confirm("Tem certeza que deseja excluir esta empresa?")) {
                    if(id > 0) {
                        let ok = false;
                        fetch(`http://localhost:5000/empresa/excluir/${id}`, {
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
                                carregarEmpresas();

                                setTimeout(() => {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }, 5000);
                            }
                            else{
                                msgRef.current.className = "msgError";
                                msgRef.current.innerHTML = r.msg;

                                setTimeout(() => {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }, 5000);
                            }
                        })
                    }
                }  
            }
            else{
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = 'Não é possivel apagar a empresa em que esta Logado';
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
            <div ref={msgRef}>

                </div>
            <div>
                <MontaTabelaEmpresa alteracao={""}  exclusao={excluirEmpresa} acesso={acessarEmpresa} lista={listaEmpresas} cabecalhos={["id","Empresa", "CNPJ", "Regime", "Email", "Telefone"]} propriedades={["empId" ,'empNome', 'empCnpj', 'empRegime', 'empEmail', 'empTelefone']} ></MontaTabelaEmpresa>
            </div>
        </div>
    )
}