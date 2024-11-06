'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import EmpContext from "../context/empContext.js";
import Link from "next/link";

export default function FormDespesa(props){

    const [despesas, setDespesas] = useState([]);
    let [listaProtocolo, setListaProtocolo] = useState([]);
    let [listaTipoDespesa, setListaTipoDespesa] = useState([]);
    const [selectedTipoDespesa, setSelectedTipoDespesa] = useState(null); // tipo de despesa selecionado
    const [selectedTipoDespesaDesc, setSelectedTipoDespesaDesc] = useState(""); // descrição do tipo selecionado
    const [isAnoMesFixed, setIsAnoMesFixed] = useState(false);
    let { emp, setEmp } = useContext(EmpContext);
    let msgRef = useRef(null);

    let [erroAno, setErroAno] = useState(false);
    let [erroMes, setErroMes] = useState(false);
    let [erroData, setErroData] = useState(false);
    let [erroTipo, setErroTipo] = useState(false);
    let [erroDescricao, setErroDescricao] = useState(false);
    let [erroValor, setErroValor] = useState(false);

    const [formData, setFormData] = useState({
        ano: '',
        mes: '',
        descricao: '',
        data: '',
        tipo: '',
        valor: '',
        protocolo: '',
    });

    useEffect(() => {
        carregarProtocolo();
        carregarTipoDespesa()
    }, []);

    //selecionar protocolo
    const [selectedProtocolo, setSelectedProtocolo] = useState(null);
    const [selectedProtocoloTitulo, setSelectedProtocoloTitulo] = useState("");

    function handleSelectProtocolo(protocolo) {
        setSelectedProtocolo(protocolo.protId); // Define o protocolo selecionado
    }

    function confirmProtocolo() {
        if (selectedProtocolo) {
            const protocolo = listaProtocolo.find(p => p.protId === selectedProtocolo);
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

    //seleciona tipo de despesa//
    const handleSelectTipoDespesa = (despesa) => {
        setSelectedTipoDespesa(despesa.tipDespId); // Atualiza o estado com o id do tipo de despesa selecionado
        setSelectedTipoDespesaDesc(despesa.tipDespDesc); // Armazena a descrição do tipo de despesa selecionado
    };

    const confirmTipoDespesa = () => {
        if (selectedTipoDespesa) {
            
            setFormData((prevData) => ({
                ...prevData,
                tipo: selectedTipoDespesa, // Define o tipo no formData
            }));
            console.log("Tipo de despesa selecionado:", selectedTipoDespesa, selectedTipoDespesaDesc);
            closePopup(); // Fecha o popup
        } else {
            alert("Por favor, selecione um tipo de despesa antes de confirmar.");
        }
    };

    //popup para selecionar tipo despesa//
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };
    //fim popup tipo despesa//

    //Popup selecionar protocolo//
    const [showPopup2, setShowPopup2] = useState(false);

    const openPopup2 = () => {
        setShowPopup2(true);
    };

    const closePopup2 = () => {
        setShowPopup2(false);
    };
    //fim popup protocolo//

    // Função para atualizar os valores dos campos
    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        // Se o ano ou mês estão fixos, ignore mudanças nesses campos
        if ((name === 'ano' || name === 'mes') && isAnoMesFixed) {
            return;
        }

        if (name === 'ano') {
            setErroAno(value === ""); // Define erro se o valor estiver vazio
        }
    
        // Atualiza o formData
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    
        // Ajusta o campo "data" com base nas mudanças do mês ou ano
        if (name === 'mes' || name === 'ano') {
            const ano = name === 'ano' ? value : formData.ano || new Date().getFullYear();
            const mes = name === 'mes' ? value : formData.mes;
    
            if (ano && mes) {
                // Define o primeiro e último dia do mês selecionado
                const firstDay = new Date(ano, mes - 1, 1).toISOString().split("T")[0];
                const lastDay = new Date(ano, mes, 0).toISOString().split("T")[0];
    
                // Atualiza o formData com limites de data (min e max)
                setFormData((prevData) => ({
                    ...prevData,
                    data: prevData.data && prevData.data >= firstDay && prevData.data <= lastDay ? prevData.data : firstDay,
                    dataMin: firstDay,
                    dataMax: lastDay,
                }));
            }
        }
    };

    // Função para adicionar uma nova despesa ao array de despesas
    const adicionarDespesa = () => {

        let ok = true; // Variável para controlar se tudo está ok

        // Verifica se o campo "ano" está vazio
        if (formData.ano == "") {
            setErroAno(true); // Marca o erro
            ok = false; // Define ok como false
        } else {
            setErroAno(false); // Remove erro se o campo não estiver vazio
        }

        if(formData.mes == "") {
            setErroMes(true);
            ok = false
        } else {
            setErroMes(false)
        }

        if(formData.data == "") {
            setErroData(true);
        } else {
            setErroData(false);
        }

        if(formData.descricao == "") {
            setErroDescricao(true);
        } else {
            setErroDescricao(false);
        }

        if(formData.valor == "") {
            setErroValor(true);
        } else {
            setErroValor(false);
        }

        if(formData.tipo == ""){
            setErroTipo(true);
        } else{
            setErroTipo(false);
        }

        
        const novaDespesa = {
            ano: formData.ano,
            mes: formData.mes,
            data: formData.data,
            tipo: formData.tipo,
            descricao: formData.descricao,
            valor: formData.valor,
            protocolo: formData.protocolo,
        };

        if(formData.ano !== "" && formData.mes !== "" && formData.data !== "" && 
            formData.tipo !== "" && formData.descricao !== "" && formData.valor !== ""){
             // Adiciona a nova despesa ao array de despesas
            setDespesas((prevDespesas) => [...prevDespesas, novaDespesa]);

            // Se for o primeiro registro, fixa "Ano" e "Mês" e impede alterações
            if (!isAnoMesFixed) {
                setIsAnoMesFixed(true);

                // Define "Ano" e "Mês" fixos no formData
                setFormData((prevData) => ({
                    ...prevData,
                    ano: novaDespesa.ano,
                    mes: novaDespesa.mes,
                    descricao: '',
                    data: '',
                    tipo: '',
                    valor: '',
                    protocolo: '',
                }));
            }
        }
        else{
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Preencha todos os campos";
        }
    };

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
    }

    // Função para submeter as despesas para o backend
    function cadastrarDespesas(){
        //fetch para cadastrar despesa
    };

    return  (
        <div className="container form-despesa" style={{ width: '900px' }}>
            <h3 className="text-center mb-4">Cadastrar Despesa</h3>
            <div ref={msgRef}>

            </div>

            <div className="row">
                <div className="col-md-2 mb-3">
                    <label>Ano:</label>
                    <input type="number" name="ano" readOnly={isAnoMesFixed} className={`form-control ${erroAno ? 'is-invalid' : ''}`} value={formData.ano} onChange={handleInputChange} />
                </div>
                <div className="col-md-2 mb-3">
                    <label>Mês:</label>
                    <input type="number" name="mes"  readOnly={isAnoMesFixed} min="1" max="12"  className={`form-control ${erroMes ? 'is-invalid' : ''}`} value={formData.mes} onChange={handleInputChange} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                        <label>Data:</label>
                        <input type="date" name="data"  className={`form-control ${erroData ? 'is-invalid' : ''}`} value={formData.data} onChange={handleInputChange} min={formData.dataMin} max={formData.dataMax} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                    <label>Tipo:</label>
                    <button  className={`btn btn-primary w-100 ${erroData ? 'btn btn-danger w-100' : ''}`} onClick={openPopup}>Selecionar Tipo</button>
                    {erroTipo && <small className="text-danger">Tipo é obrigatório</small>}
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

                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup">
                                <aside ref={msgRef}></aside>

                                <div className="popup-title">Selecionar Tipo de despesa</div>
                                <div className="popup-content">
                                    {/* Lista de tipos de despesa */}
                                    {listaTipoDespesa.length === 0 ? (
                                    <p className="text-center">Nenhum registro disponível.</p>
                                    ) : (
                                    <ul className="despesa-list">
                                        {listaTipoDespesa.map((despesa, index) => (
                                            <li
                                                 key={index}
                                                onClick={() => handleSelectTipoDespesa(despesa)}
                                                className={`despesa-item ${selectedTipoDespesa === despesa.tipDespId ? "selected" : ""}`}>
                                                {despesa.tipDespId} | {despesa.tipDespDesc}
                                            </li>
                                        ))}
                                    </ul>
                                    )}
                                </div>

                                <div className="popup-buttons2">
                                    <button className="btn btn-danger" id="fechar" onClick={closePopup}>Cancelar</button>
                                    <button className="btn btn-primary" id="criarSala" onClick={confirmTipoDespesa}>Confirmar</button>
                                </div>
                            </div>
                        </div>
                    )}

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