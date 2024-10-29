'use client'
import MontaTabela from "@/app/components/montaTabela";
import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react"
import UserContext from "../../context/userContext.js"

export default function usuariosAdmin() {

    let msgRef = useRef(null)

    let [listaUsuarios, setListaUsuarios] = useState([]);
    let [mostrarInativos, setMostrarInativos] = useState(false);
    let usuarioLogado
    const {user, setUser} = useContext(UserContext)
    let timeoutId;

    

    useEffect(() => {
        carregarUsuarios();

        // Limpa o timeout quando o componente desmonta
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

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
            let usuariosFormatados = r.map(usuario => ({
                ...usuario,
                usuNivel: usuario.usuNivel === 0 ? "Administrador" : "Usuário",
                usuStatus: usuario.usuStatus === 0 ? "Ativo" : "Inativo"
            }));
            setListaUsuarios(usuariosFormatados);
        })
    }

    let usuariosExibidos = mostrarInativos
    ? listaUsuarios
    : listaUsuarios.filter(usuario => usuario.usuStatus === "Ativo");

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

                            timeoutId = setTimeout(() => {
                                if (msgRef.current) {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }
                            }, 5000);
                        }
                        else{
                            msgRef.current.className = "msgError";
                            msgRef.current.innerHTML = r.msg;

                            timeoutId = setTimeout(() => {
                                if (msgRef.current) {
                                    msgRef.current.innerHTML = '';
                                    msgRef.current.className = '';
                                }
                            }, 5000);
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
            <div>
                <label>
                    <input 
                        type="checkbox" 
                        checked={mostrarInativos} 
                        onChange={() => setMostrarInativos(!mostrarInativos)} 
                    />
                    Exibir Usuários Inativos
                </label>
            </div>
            <div ref={msgRef}>

            </div>
            <div>
                <MontaTabela alteracao={'/admin/usuarios/alteracao'}  exclusao={excluirUsuario} exibir={"/admin/usuarios/exibir"}  lista={usuariosExibidos} cabecalhos={["id","Nome", "Email", "Status", "Nivel", "Telefone"]} 
                propriedades={["usuId" ,'usuNome', 'usuEmail', 'usuStatus', 'usuNivel', 'usuTelefone']} linhaEstilo={(usuario) => usuario.usuStatus === "Inativo" ? { color: "red" } : {}} >
                    
                </MontaTabela>
            </div>
        </div>
    )
}