'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";
import { useRouter } from "next/navigation";

export default function faturamentoAdmin(){

    let msgRef = useRef(null);

    let {emp, setEmp} = useContext(EmpContext)
    let [listaAnos, setListaAnos] = useState([]);
    const [loading, setLoading] = useState(true);

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
        fetch(`http://localhost:5000/faturamento/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaAnos(r);
        })
    }

    return (
        <div>
            <h1>Lista de Anos Faturamento</h1>
            <div>
                <Link href="/admin/faturamento/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar Faturamento</Link>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabela alteracao={"/admin/faturamento/alteracao"}  exclusao={""} exibir={"/admin/faturamento/exibir"} lista={listaAnos} cabecalhos={["Ano","Valor Total"]} propriedades={["ano", "totalFaturamento"]} ></MontaTabela>
            </div>
        </div>
    )
}
