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
    let {user, setUser} = useContext(UserContext)
    let [query, setQuery] = useState("");
    let timeoutId;

    let usuariosExibidos = listaUsuarios.filter(usuario => {
        let statusMatch = mostrarInativos || usuario.usuStatus === "Ativo";
        let queryMatch = query === "" || usuario.usuNome.toLowerCase().includes(query.toLowerCase());
        return statusMatch && queryMatch;
    });

    
    
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

    function buscarUsuario() {
        if (query.trim() !== "") {
            fetch(`http://localhost:5000/usuarios/buscar?query=${encodeURIComponent(query)}`, {
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
                        msgRef.current.innerHTML = "Nenhuma usuario encontrado.";
                        setListaUsuarios([]); // Limpa a lista se não houver resultados
                        setTimeout(() => {
                            msgRef.current.innerHTML = '';
                            msgRef.current.className = '';
                        }, 3000);
                    } else {
                        // Mapeia os dados para os novos nomes
                        const mappedData = r.map(item => ({
                            usuId: item.usu_id,
                            usuNome: item.usu_nome,
                            usuEmail: item.usu_email,
                            usuStatus: item.usu_status == 0 ? "Ativo" : "Inativo",
                            usuNivel: item.usu_nivel == 0 ? "Administrador" : "Usuário",
                            usuTelefone: item.usu_telefone
                        }));
    
                        setListaUsuarios(mappedData);
                    }
                } else {
                    // Caso não seja um array, você pode exibir uma mensagem de erro
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = "Sem resultado.";
                    setListaUsuarios([]); // Limpa a lista em caso de erro
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
                console.error("Erro ao buscar Usuario:", err);
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Sem resultado.";
                setListaUsuarios([]); // Limpa a lista em caso de erro
                timeoutId = setTimeout(() => {
                    if (msgRef.current) {
                        msgRef.current.innerHTML = '';
                        msgRef.current.className = '';
                    }
                }, 5000);
            });
        } else {
            carregarUsuarios();
        }
    }

    return (
        <div>
            <h1>Usuarios cadastrados</h1>
            <div>
                <Link href="/admin/usuarios/cadastro" style={{marginBottom: "15px"}} className="btn btn-primary">Cadastrar usuario</Link>
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
                                    buscarUsuario(); // Busca quando Enter é pressionado
                                }
                            }}
                        />
                        <label htmlFor="floatingInput">Buscar</label>
                    </div>
                    <button onClick={buscarUsuario} className="btn btn-primary" style={{ width: '100px' }}><i className="fa-solid fa-magnifying-glass"></i></button> {/* Ajuste a largura do botão */}
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