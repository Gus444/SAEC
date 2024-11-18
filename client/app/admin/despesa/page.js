'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";
import { useRouter } from "next/navigation";
import MontaTabelaFaturamento from "@/app/components/montaTabelaAnos";
import MontaTabelaAnos from "@/app/components/montaTabelaAnos";

export default function despesaAdmin(){

    let msgRef = useRef(null);

    let {emp, setEmp} = useContext(EmpContext)
    let [listaAnos, setListaAnos] = useState([]);
    const [loading, setLoading] = useState(true);
    let timeoutId;

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

    return (
        <div>
            <h1>Lista de Anos Despesa</h1>
            <div>
                <Link href="/admin/despesa/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar Despesa</Link>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaAnos alteracao={"/admin/despesa/alteracao"}  exclusao={excluirDespesa} exibir={"/admin/despesa/exibir"} lista={listaAnos} cabecalhos={["Ano","Valor Total"]} propriedades={["ano", "totalDespesa"]} campoExclusao="ano" ></MontaTabelaAnos>
            </div>
        </div>
    )
}
