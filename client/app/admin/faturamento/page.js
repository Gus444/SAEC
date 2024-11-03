'use client'
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react"
import EmpContext from '@/app/context/empContext';
import MontaTabela from "@/app/components/montaTabela";
import { useRouter } from "next/navigation";
import MontaTabelaFaturamento from "@/app/components/montaTabelaFaturamento";

export default function faturamentoAdmin(){

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
        fetch(`http://localhost:5000/faturamento/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r => r.json())
        .then(r => {
            const listaAnosComPrefixo = r.map(item => ({
                ...item,
                totalFaturamento: `R$ ${item.totalFaturamento.toFixed(2).replace('.', ',')}`, // Formata o valor
            }));
            setListaAnos(listaAnosComPrefixo);
        });
    }

    async function excluirFaturamento(ano) {
        msgRef.current.className = '';
        msgRef.current.innerHTML = '';
    
        if (confirm("Tem certeza que deseja excluir este período?")) {
    
            if (ano) {
                let ok = false;
    
                fetch(`http://localhost:5000/faturamento/excluir/ano/${ano}/empresa/${emp.empId}`, {
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
            <h1>Lista de Anos Faturamento</h1>
            <div>
                <Link href="/admin/faturamento/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar Faturamento</Link>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabelaFaturamento alteracao={"/admin/faturamento/alteracao"}  exclusao={excluirFaturamento} exibir={"/admin/faturamento/exibir"} lista={listaAnos} cabecalhos={["Ano","Valor Total"]} propriedades={["ano", "totalFaturamento"]} campoExclusao="ano" ></MontaTabelaFaturamento>
            </div>
        </div>
    )
}
