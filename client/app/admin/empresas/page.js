'use client'
import MontaTabela from "@/app/components/montaTabela";
import Link from "next/link";
import { useEffect, useRef, useState } from "react"

export default function empresasAdmin() {

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

    function excluirEmpresa(id) {

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
                        alert(r.msg)
                        carregarEmpresas();
                    }
                    else{
                        alert(r.msg);
                    }
                })
            }
        }
    }

    return (
        <div>
            <h1>Empresas cadastradas</h1>
            <div>
                <Link href="/admin/empresas/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar empresa</Link>
            </div>
            <div>
                <MontaTabela alteracao={""}  exclusao={excluirEmpresa} lista={listaEmpresas} cabecalhos={["id","Empresa", "CNPJ", "Regime"]} propriedades={["empId" ,'empNome', 'empCnpj', 'empRegime']} ></MontaTabela>
            </div>
        </div>
    )
}