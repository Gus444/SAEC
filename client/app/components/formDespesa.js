'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import EmpContext from "../context/empContext.js";
import Link from "next/link";

export default function FormDespesa(props){
    const [despesas, setDespesas] = useState([]);
    let [listaProtocolo, setListaProtocolo] = useState([]);
    let [listaTipoDespesa, setListaTipoDespesa] = useState([]);
    let { emp, setEmp } = useContext(EmpContext);
    let msgRef = useRef(null);
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
            // Armazena o título do protocolo selecionado
            const protocolo = listaProtocolo.find(p => p.protId === selectedProtocolo);
            setSelectedProtocoloTitulo(protocolo.protTitulo);
    
            closePopup2(); // Fecha a popup
        } else {
            alert("Por favor, selecione um protocolo antes de confirmar.");
        }
    }
    //////////////////////

    //seleciona tipo de despesa//
    const [selectedTipoDespesa, setSelectedTipoDespesa] = useState(null);
    const [selectedTipoDespesaDesc, setSelectedTipoDespesaDesc] = useState("");

    function handleSelectTipoDespesa(TipoDespesa) {
        setSelectedTipoDespesa(TipoDespesa.tipDespId); // Define a despesa selecionado
    }

    function confirmTipoDespesa() {
        if (selectedTipoDespesa) {
            // Armazena o título da despesa selecionado
            const tipoDespesa = listaTipoDespesa.find(p => p.tipDespId === selectedTipoDespesa);
            setSelectedTipoDespesaDesc(tipoDespesa.tipDespDesc);
    
            closePopup2(); // Fecha a popup
        } else {
            alert("Por favor, selecione um tipo antes de confirmar.");
        }
    }

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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Função para adicionar uma nova despesa ao array de despesas
    const adicionarDespesa = () => {
        // Verifica se todos os campos necessários estão preenchidos
        if (formData.ano && formData.mes && formData.descricao && formData.data && formData.valor && selectedProtocolo) {
            const novaDespesa = {
                ano: formData.ano,
                mes: formData.mes,
                descricao: formData.descricao,
                data: formData.data,
                //tipo: selectedTipo, // Certifique-se de que você tenha a variável `selectedTipo`
                valor: formData.valor,
                protocolo: selectedProtocolo // Aqui você adiciona o ID do protocolo
            };
    
            setDespesas([...despesas, novaDespesa]); // Atualiza a lista de despesas
            setFormData({ ano: "", mes: "", descricao: "", data: "", valor: "" }); // Reseta os campos do formulário
            setSelectedProtocolo(null); // Reseta o protocolo selecionado
            setSelectedProtocoloTitulo(""); // Reseta o título do protocolo selecionado
        } else {
            alert("Por favor, preencha todos os campos necessários e selecione um protocolo.");
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

            <div className="row">
                <div className="col-md-2 mb-3">
                    <label>Ano:</label>
                    <input type="number" name="ano" className="form-control" value={formData.ano} onChange={handleInputChange} />
                </div>
                <div className="col-md-2 mb-3">
                    <label>Mês:</label>
                    <input type="number" name="mes" min="1" max="12" className="form-control" value={formData.mes} onChange={handleInputChange} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                        <label>Data:</label>
                        <input type="date" name="data" className="form-control" value={formData.data} onChange={handleInputChange} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                    <label>Tipo:</label>
                    <button className="btn btn-primary w-100" onClick={openPopup}>Selecionar Tipo</button>
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
                                                className={`despesa-item ${selectedTipoDespesa === despesa.tipDespId ? "selected" : ""}`}
                                            >
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
                        <input type="text" name="descricao" className="form-control" value={formData.descricao} onChange={handleInputChange} />
                    </div>
            </div>

            <div className="row">
                <div className="col-md-2 mb-3">
                    <label>Valor:</label>
                    <input type="number" name="valor" className="form-control" value={formData.valor} onChange={handleInputChange} />
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