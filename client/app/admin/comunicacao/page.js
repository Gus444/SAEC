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

    useEffect((e) => {
        carregarComunicacao();
    }, [])

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
        fetch("http://localhost:5000/comunicacao", {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaComunicacao(r);
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

                            setTimeout(() => {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }, 2000);
                        }
                        else{
                            msgRef.current.className = "msgError";
                            msgRef.current.innerHTML = r.msg;

                            setTimeout(() => {
                                msgRef.current.innerHTML = '';
                                msgRef.current.className = '';
                            }, 2000);
                        }
                    })
                }
            }  
    }    

    return (
        <div>
            <h1>Lista de comunicação</h1>
            <div>
                <Link href="/admin/comunicacao/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar comunicação</Link>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabela alteracao={""}  exclusao={excluirComunicacao} exibir={"/admin/comunicacao/exibir"} lista={listaComunicacao} cabecalhos={["id","Titulo", "Canal", "Data", "Hora", "Usuario", "Empresa"]} propriedades={['comId', 'comTitulo', 'comCanal', 'comData', 'comHora', "usuario.usuNome", "empresa.empNome"]} ></MontaTabela>
            </div>
        </div>
    )
}