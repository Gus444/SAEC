'use client'
import MontaTabela from "@/app/components/montaTabela";
import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react"
import UserContext from "../../context/userContext.js"

export default function usuariosAdmin() {

    let msgRef = useRef(null)

    let [listaUsuarios, setListaUsuarios] = useState([]);
    let usuarioLogado
    const {user, setUser} = useContext(UserContext)

    useEffect((e) => {
        carregarUsuarios();
    }, [])

    function carregarUsuarios() {
        fetch("http://localhost:5000/usuarios", {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaUsuarios(r);
        })
    }

    async function excluirUsuario(id) {

        msgRef.current.className = ''
        msgRef.current.innerHTML = ''

        let usuario = await fetch(`http://localhost:5000/usuarios/obter/${id}`,{
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        });
        let dados = await usuario.json();
        usuarioLogado = dados.usuId

        if(user.usuId != usuarioLogado){
            if(confirm("Tem certeza que deseja excluir este usuario?")) {
                if(id > 0) {
                    let ok = false;
                    fetch(`http://localhost:5000/usuarios/excluir/${id}`, {
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
                            carregarUsuarios();

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
        else{
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = 'Não é possivel apagar o proprio usuário';
        }    
    }

    return (
        <div>
            <h1>Usuarios cadastrados</h1>
            <div>
                <Link href="/admin/usuarios/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar usuario</Link>
            </div>
            <div ref={msgRef}>

                </div>
            <div>
                <MontaTabela alteracao={""}  exclusao={excluirUsuario} exibir={"/admin/usuarios/exibir"}  lista={listaUsuarios} cabecalhos={["id","Nome", "Email", "Status", "Nivel", "Telefone"]} propriedades={["usuId" ,'usuNome', 'usuEmail', 'usuStatus', 'usuNivel', 'usuTelefone']} ></MontaTabela>
            </div>
        </div>
    )
}