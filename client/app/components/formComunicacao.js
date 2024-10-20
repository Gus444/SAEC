'use client'
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormComunicacao(props){

    let router = useRouter();

    let comunicacao = 
    props.comunicacao != null ? 
        props.comunicacao 
    : 
        {  
            comId: "", comTitulo: "", comCanal: "", comData: "", comHora: "", comDescricao: ""
        }

    let isAlteracao = comunicacao.comId != null;

    let titulo = useRef("");
    let canal = useRef("");
    let data = useRef("");
    let hora = useRef("");
    let descricao = useRef("");

    let msgRef = useRef(null);

    let [erroTitulo, setErroTitulo] = useState(false);
    let [erroCanal, setErroCanal] = useState(false);
    let [erroData, setErroData] = useState(false);
    let [erroHora, setErroHora] = useState(false);

    return(
        <div className="container mt-1 d-flex justify-content-center">
            <div className="card mt-5 p-4 shadow" style={{ width: '800px' }}>
                <div ref={msgRef}>

                </div>
                <h2 className="mb-4">{isAlteracao ? "Alterar Comunicação" : "Cadastrar Comunição"}</h2>

                <div className="row">
                    <div className="col-md-5 form-group mb-3">
                        <label htmlFor="nome">Titulo*</label>
                        <input defaultValue={comunicacao.comTitulo} ref={titulo} type="text" className={`form-control ${erroTitulo ? 'is-invalid' : ''}`} onChange={() => setErroTitulo(false)} placeholder="Digite o Titulo"/>
                    </div>

                    <div className="col-md-3 form-group mb-3">
                            <label htmlFor="canal">Canal*</label>
                            <input defaultValue={comunicacao.comCanal} ref={canal} type="text" className={`form-control ${erroCanal ? 'is-invalid' : ''}`} onChange={() => setErroCanal(false)} maxLength="15" placeholder="Digite o Canal"/>
                    </div>
                </div>


                <div className="col-md-7 form-group mb-3">
                            <label htmlFor="email">Data*</label>
                            <input defaultValue={comunicacao.comData} ref={data} type="date" className={`form-control ${erroData ? 'is-invalid' : ''}`} onChange={() => setErroData(false)} placeholder="Digite a Data"/>
                </div>

                <div className="col-md-5 form-group mb-3">
                        <label htmlFor="hora">Hora*</label>
                        <input defaultValue={comunicacao.comHora} ref={hora} type="time" className={`form-control ${erroHora ? 'is-invalid' : ''}`} onChange={() => setErroHora(false)} placeholder="??"/>
                    </div>
                        
                    <div className="form-group mb-3">
                        <label htmlFor="nome">Descricão*</label>
                        <input defaultValue={comunicacao.comDescricao} ref={descricao} type="textarea" className="form-control" maxlength="100"/>
                    </div>


                <div className="d-flex justify-content-between mt-4">
                <button
                    onClick={() => isAlteracao ? alterarUsuario(comunicacao.comId) : gravarComunicacao()}
                    className="btn btn-primary"
                >
                    {isAlteracao ? "Alterar" : "Cadastrar"}
                </button>
                <Link href="/admin/comunicacao" className="btn btn-outline-secondary">Voltar</Link>
                </div>

            </div>
        </div>
    );
}