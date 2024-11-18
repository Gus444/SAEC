'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import EmpContext from "../context/empContext.js";
import Link from "next/link";
import CadastroTipoDespesa from "./cadastroTD.js";

export default function FormDespesa(props){

    let [despesas, setDespesas] = useState([]);
    const [showCadastro, setShowCadastro] = useState(false);
    let [listaProtocolo, setListaProtocolo] = useState([]);
    let [listaTipoDespesa, setListaTipoDespesa] = useState([]);
    let [tipoDespesaInput, setTipoDespesaInput] = useState("");
    let [isAnoMesFixed, setIsAnoMesFixed] = useState(false);
    let { emp, setEmp } = useContext(EmpContext);
    let msgRef = useRef(null);
    let msgStatus = useRef(null);
    let router = useRouter();
    let timeoutId;

    let [erroAno, setErroAno] = useState(false);
    let [erroMes, setErroMes] = useState(false);
    let [erroData, setErroData] = useState(false);
    let [erroTipo, setErroTipo] = useState(false);
    let [erroDescricao, setErroDescricao] = useState(false);
    let [erroValor, setErroValor] = useState(false);

    //selecionar protocolo
    let [selectedProtocolo, setSelectedProtocolo] = useState(null);
    let [selectedProtocoloTitulo, setSelectedProtocoloTitulo] = useState("");

    let [formData, setFormData] = useState({
        ano: '',
        mes: '',
        descricao: '',
        data: '',
        tipo: '',
        valor: '',
        protocolo: '',
    })
    

     //funcao pra pegar os protocolos
     function carregarProtocolo() {
        fetch(`http://localhost:5000/protocolo/${emp.empId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaProtocolo(r);
        })
    }

    function carregarTipoDespesa() {
        fetch(`http://localhost:5000/tipoDespesa/`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setListaTipoDespesa(r);
        })
    };

    useEffect(() => {
        carregarProtocolo();
        carregarTipoDespesa()
    }, []);

    

    function handleSelectProtocolo(protocolo) {
        setSelectedProtocolo(protocolo.protId); // Define o protocolo selecionado
    }

    function confirmProtocolo() {
        if (selectedProtocolo) {
            let protocolo = listaProtocolo.find(p => p.protId === selectedProtocolo);
            setSelectedProtocoloTitulo(protocolo.protTitulo);
    
            setFormData((prevData) => ({
                ...prevData,
                protocolo: selectedProtocolo,
            }));
    
            closePopup2();
        } else {
            alert("Por favor, selecione um protocolo antes de confirmar.");
        }
    }
    //////////////////////

    // Função de filtro para mostrar sugestões enquanto o usuário digita
    let handleTipoDespesaChange = (event) => {
        const value = event.target.value;
        setTipoDespesaInput(value);
    
        if (value) {
            const filtered = listaTipoDespesa.filter(despesa =>
                despesa.tipDespDesc.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTipoDespesa(filtered);
            setShowDropdown(filtered.length > 0);  // Mostra o dropdown apenas se houver sugestões
        } else {
            setFilteredTipoDespesa([]);
            setShowDropdown(false);
        }
    };

    let selectTipoDespesa = (despesa) => {
        setTipoDespesaInput(despesa.tipDespDesc);
        setFormData((prevData) => ({
            ...prevData,
            tipo: despesa.tipDespId,
        }));
        setShowDropdown(false);
    };


    //Popup selecionar protocolo//
    let [showPopup2, setShowPopup2] = useState(false);

    let openPopup2 = () => {
        setShowPopup2(true);
    };

    let closePopup2 = () => {
        setShowPopup2(false);
    };
    //fim popup protocolo//

    // Função para atualizar os valores dos campos
    const validarCampoIndividual = (campo, valor) => {
        let anoAtual = new Date().getFullYear();
        let erro = true;
    
        switch (campo) {
            case 'ano':
                erro = !valor || valor > anoAtual || valor < 2000;
                setErroAno(erro);
                break;
            case 'mes':
                erro = !valor;
                setErroMes(erro);
                break;
            case 'data':
                erro = !valor || !(valor >= formData.dataMin && valor <= formData.dataMax);
                setErroData(erro);
                break;
            case 'descricao':
                erro = !valor || !valor.toString().trim();
                setErroDescricao(erro);
                break;
            case 'valor':
                erro = !valor || valor <= 0;
                setErroValor(erro);
                break;
            case 'tipo':
                erro = !valor;
                setErroTipo(erro);
                break;
            default:
                break;
        }
        return !erro; // Retorna true se não houver erro no campo
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if ((name === 'ano' || name === 'mes') && isAnoMesFixed) {
            return;
        }
    
        // Atualiza o formData
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    
        // Valida apenas o campo atual
        validarCampoIndividual(name, value);
    
        // Atualiza limites de data para o campo "data" quando ano ou mês mudam
        if (name === 'mes' || name === 'ano') {
            const ano = name === 'ano' ? value : formData.ano || new Date().getFullYear();
            const mes = name === 'mes' ? value : formData.mes;
    
            if (ano && mes) {
                const firstDay = new Date(ano, mes - 1, 1).toISOString().split("T")[0];
                const lastDay = new Date(ano, mes, 0).toISOString().split("T")[0];
    
                setFormData((prevData) => ({
                    ...prevData,
                    data: prevData.data && prevData.data >= firstDay && prevData.data <= lastDay ? prevData.data : firstDay,
                    dataMin: firstDay,
                    dataMax: lastDay,
                }));
            }
        }
    };
    
    const adicionarDespesa = () => {
        // Valida todos os campos individualmente
        const isAnoValido = validarCampoIndividual('ano', formData.ano);
        const isMesValido = validarCampoIndividual('mes', formData.mes);
        const isDataValida = validarCampoIndividual('data', formData.data);
        const isDescricaoValida = validarCampoIndividual('descricao', formData.descricao);
        const isValorValido = validarCampoIndividual('valor', formData.valor);
        const isTipoValido = validarCampoIndividual('tipo', formData.tipo);
    
        // Verifica se há algum erro nos campos
        if (isAnoValido && isMesValido && isDataValida && isDescricaoValida && isValorValido && isTipoValido) {
            // Se tudo for válido, cria a nova despesa
            let novaDespesa = {
                ano: formData.ano,
                mes: formData.mes,
                data: formData.data,
                tipo: formData.tipo,
                descricao: formData.descricao,
                valor: formData.valor,
                empresa: emp.empId,
                protocolo: formData.protocolo || "Sem Protocolo",
            };
    
            // Adiciona a nova despesa na lista
            setDespesas((prevDespesas) => [...prevDespesas, novaDespesa]);
    
            // Define ano e mês como fixos se ainda não estiverem
            if (!isAnoMesFixed) {
                setIsAnoMesFixed(true);
                setFormData((prevData) => ({
                    ...prevData,
                    ano: novaDespesa.ano,
                    mes: novaDespesa.mes,
                }));
            }
    
            // Limpa os campos restantes
            setFormData((prevData) => ({
                ...prevData,
                descricao: '',
                data: '',
                tipo: '',
                valor: '',
                protocolo: '',
            }));
        } else {
            // Mostra mensagem de erro se houver campos inválidos
            if (msgRef.current) {
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = "Preencha todos os campos corretamente";
    
                setTimeout(() => {
                    if (msgRef.current) {
                        msgRef.current.innerHTML = '';
                        msgRef.current.className = '';
                    }
                }, 7000);
            }
        }
    };

    const handleSave = async (novoTipo) => {
        const dados = { tipDespDesc: novoTipo };

        const response = await fetch("http://localhost:5000/tipoDespesa", {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            // Recarrega os tipos de despesa após salvar
            carregarTipoDespesa();
        }
    };


    // Função para submeter as despesas para o backend
    function cadastrarDespesas(){
          
        if (despesas.length === 0) {
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Nenhuma despesa para salvar.";

            timeoutId = setTimeout(() => {
                if (msgRef.current) {
                    msgRef.current.innerHTML = '';
                    msgRef.current.className = '';
                    msgRef.current.classList.remove("msgError");
                }
            }, 7000);
            return;
        }

        const despesasV = despesas.map(despesa => {
            if (!despesa.protocolo || despesa.protocolo === "") {
                despesa.protocolo = null; // Atribui null se protId estiver vazio
            }
            return despesa;
        });

        if (msgStatus.current) {
            msgStatus.current.className = "msgSuccess";
            msgStatus.current.innerHTML = "Despesas gravadas com sucesso!";
        }
    
        // Faz a requisição de envio das despesas
        fetch('http://localhost:5000/controleDespesa/', {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(despesasV) // Envia o array de despesas como JSON
        })
        .then(r => {
            if (r.status === 201) {
                msgStatus.current.className = "msgSuccess";
                msgStatus.current.innerHTML = "Despesas gravadas com sucesso!";
                setDespesas([]); // Limpa o array de despesas após salvar
                router.push("/admin/despesa");
            } else {
                msgStatus.current.className = "msgError";
                msgStatus.current.innerHTML = r.message;
            }
        })
    };

    return  (
        <div className="container form-despesa" style={{ width: '900px' }}>
            <h3 className="text-center mb-4">Cadastrar Despesa</h3>
            <div ref={msgRef}></div>
            <div ref={msgStatus}></div>

            <div className="row">
                <div className="col-md-2 mb-3">
                    <label>Ano:</label>
                    <input type="number" name="ano" readOnly={isAnoMesFixed} className={`form-control ${erroAno ? 'is-invalid' : ''}`} value={formData.ano} onChange={handleInputChange} />
                    {erroAno && <small className="text-danger">Ano invalido</small>}
                </div>
                <div className="col-md-3 mb-3">
                    <label>Mês:</label>
                    <select type="number" name="mes"  readOnly={isAnoMesFixed} min="1" max="12"  className={`form-control ${erroMes ? 'is-invalid' : ''}`} value={formData.mes} onChange={handleInputChange}>
                    <option value="0">Selecione o Mês</option>
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                        <label>Data:</label>
                        <input type="date" name="data"  className={`form-control ${erroData ? 'is-invalid' : ''}`} value={formData.data} onChange={handleInputChange} min={formData.dataMin} max={formData.dataMax} />
                </div>
            </div>

            <div className="row">
            <div className="col-md-3 mb-3 position-relative">
                <label>Tipo de Despesa:</label>
                <select
                    name="tipo" className={`form-control ${erroTipo ? 'is-invalid' : ''}`}
                    value={tipoDespesaInput}
                    onChange={(e) => {
                        const selectedValue = e.target.value;
                        setTipoDespesaInput(selectedValue);
                        if (selectedValue) {
                            setErroTipo(false);
                        }        

                        // Encontra o tipo de despesa pelo nome
                        const selectedDespesa = listaTipoDespesa.find(
                            (despesa) => despesa.tipDespDesc === selectedValue
                        );
                        if (selectedDespesa) {
                            setFormData((prevData) => ({
                                ...prevData,
                                tipo: selectedDespesa.tipDespId,
                            }));
                        }
                    }}
                    placeholder="Selecione o tipo de despesa"
                >
                    <option value="">Selecione</option>
                    {listaTipoDespesa.map((despesa) => (
                        <option key={despesa.tipDespId} value={despesa.tipDespDesc}>
                            {despesa.tipDespDesc}
                        </option>
                    ))}
                </select>
                <button className="btn btn-link" onClick={() => setShowCadastro(true)}><i className="fas fa-plus"></i></button>
                {erroTipo && <small className="text-danger">Tipo é obrigatório</small>}

                    {showCadastro && (
                    <CadastroTipoDespesa
                        onClose={() => setShowCadastro(false)}
                        onSave={handleSave}
                    />
                )}
            </div>

                <div className="col-md-3 mb-3">
                    <label>Protocolo:</label>
                    <button className="btn btn-primary w-100" onClick={openPopup2}>
                        {selectedProtocoloTitulo ? `Protocolo: ${selectedProtocoloTitulo}` : "Selecionar Protocolo"}
                    </button>
                    {selectedProtocoloTitulo && (
                        <small className="text-muted">Selecionado: {selectedProtocoloTitulo}</small>
                    )}
                </div>
            </div>

                    {showPopup2 && (
                            <div className="popup-overlay2">
                            <div className="popup2">
                                <aside ref={msgRef}></aside>
                    
                                <div className="popup-title2">Selecione o protocolo</div>
                    
                                <div className="popup-content2">
                                    {/* Lista de protocolos */}
                                    {listaProtocolo.length === 0 ? (
                                    <p className="text-center">Nenhum registro disponível.</p>
                                     ) : (
                                    <ul className="protocol-list">
                                        {listaProtocolo.map((protocolo, index) => (
                                            <li
                                            key={index}
                                            onClick={() => handleSelectProtocolo(protocolo)}
                                            className={`protocol-item ${selectedProtocolo === protocolo.protId ? "selected" : ""}`}
                                            >
                                                {protocolo.protId} | {protocolo.protTitulo}
                                            </li>
                                        ))}
                                    </ul>
                                     )}
                                </div>
                    
                                <div className="popup-buttons2">
                                    <button className="btn btn-danger" onClick={closePopup2}>Cancelar</button>
                                    <button className="btn btn-primary" onClick={confirmProtocolo}>Confirmar</button>
                                </div>
                            </div>    
                        </div>
                     )}

            <div className="row">
                    <div className="col-md-12 mb-3">
                        <label>Descrição:</label>
                        <input type="text" name="descricao"  className={`form-control ${erroDescricao ? 'is-invalid' : ''}`} value={formData.descricao} onChange={handleInputChange} />
                    </div>
            </div>

            <div className="row">
                <div className="col-md-2 mb-3">
                    <label>Valor:</label>
                    <input type="number" name="valor" className={`form-control ${erroValor ? 'is-invalid' : ''}`} value={formData.valor} onChange={handleInputChange} />
                </div>
            </div>
            <div className="text-center">
                <button className="btn btn-success mb-4" onClick={adicionarDespesa}>Adicionar</button>
            </div>

            {/* Grid/Tabela para exibir despesas adicionadas */}
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Ano</th>
                        <th>Mês</th>
                        <th>Descrição</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Protocolo</th>
                    </tr>
                </thead>
                <tbody>
                    {despesas.map((despesa, index) => (
                        <tr key={index}>
                            <td>{despesa.ano}</td>
                            <td>{despesa.mes}</td>
                            <td>{despesa.descricao}</td>
                            <td>{despesa.data}</td>
                            <td>{despesa.tipo}</td>
                            <td>{despesa.valor}</td>
                            <td>{despesa.protocolo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botões de ação para cancelar ou cadastrar despesas */}
            <div className="d-flex justify-content-between mt-3">
                <Link href="/admin/despesa" className="btn btn-outline-secondary">Voltar</Link>
                <button className="btn btn-primary" onClick={cadastrarDespesas}>Cadastrar</button>
            </div>
        </div>
    );
}