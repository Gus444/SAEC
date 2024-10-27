'use client'
import { useEffect, useRef, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmpContext from "../context/empContext.js";
import UserContext from "../context/userContext.js";

export default function FormFaturamento(props) {

    let [erroAno, setErroAno] = useState(false);
    let { user, setUser } = useContext(UserContext);
    let { emp, setEmp } = useContext(EmpContext);
    let router = useRouter();
    
    let faturamento = 
    props.faturamento != null ? 
        props.faturamento 
    : 
        {  
            ano: "", meses: {janeiro: 0, 
                            fevereiro: 0, 
                            marco: 0,
                            abril: 0,
                            maio: 0, 
                            junho: 0, 
                            julho: 0, 
                            agosto: 0,
                            setembro: 0,
                            outubro: 0,
                            novembro: 0,
                            dezembro: 0}, empresa: "", usuario: ""
        }

    let isAlteracao = faturamento.length > 0 && faturamento[0].ano != null && faturamento[0].ano !== "";

    let usuario = user.usuId;
    let empresa = emp.empId;

    let msgRef = useRef(null);
    let ano = useRef("");
    let janeiro = useRef("");
    let fevereiro = useRef("");
    let marco = useRef("");
    let abril = useRef("");
    let maio = useRef("");
    let junho = useRef("");
    let julho = useRef("");
    let agosto = useRef("");
    let setembro = useRef("");
    let outubro = useRef("");
    let novembro = useRef("");
    let dezembro = useRef("");

    function gravar(){

        let ok = true;

        if(ano.current.value == ""){
            setErroAno(true);
            ok = false
        } else{
            setErroAno(false)
        }

        msgRef.current.className = '';
        msgRef.current.innerHTML = '';

        if(ok){
            
            let valores = {
                ano: ano.current.value,
                meses: {
                    janeiro: janeiro.current.value || 0,
                    fevereiro: fevereiro.current.value || 0,
                    marco: marco.current.value || 0,
                    abril: abril.current.value || 0,
                    maio: maio.current.value || 0,
                    junho: junho.current.value || 0,
                    julho: julho.current.value || 0,
                    agosto: agosto.current.value || 0,
                    setembro: setembro.current.value || 0,
                    outubro: outubro.current.value || 0,
                    novembro: novembro.current.value || 0,
                    dezembro: dezembro.current.value || 0,
                },
                usuario: usuario,
                empresa: empresa
            }

            fetch('http://localhost:5000/competencia', {
                mode: 'cors',
                credentials: 'include',
                method: "POST",
                headers:{
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ano: valores.ano, empresa: valores.empresa})//primeiro o ano
            })
            .then(res => {
                ok = res.status == 201;
                return res.json();
            })
            .then(res => {//inserir na faturamento
                if(ok){
                    fetch('http://localhost:5000/faturamento',{
                        mode: 'cors',
                        credentials: 'include',
                        method: "POST",
                        headers:{
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify(valores)
                    })
                    .then(res => {
                        if (!res.ok) {
                            msgRef.current.className = "msgError";
                            msgRef.current.innerHTML = res.msg;
                        }
                        return res.json();
                    })
                    .then(res => {
                        if (res) {
                            router.push("/admin/faturamento");
                        } else {
                            msgRef.current.className = "msgError";
                            msgRef.current.innerHTML = res.msg;
                        }
                    })
                }
                else{
                    msgRef.current.className = "msgError";
                    msgRef.current.innerHTML = res.msg;
                }  
            })
        }
        else
        {
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Preencha todos os campos";
        }
    }

    function alterar(empresa, ano){

        let ok = true;

        msgRef.current.className = '';
        msgRef.current.innerHTML = '';

        if(ok){
            
            let valores = {
                ano: ano,
                meses: {
                    janeiro: janeiro.current.value || 0,
                    fevereiro: fevereiro.current.value || 0,
                    marco: marco.current.value || 0,
                    abril: abril.current.value || 0,
                    maio: maio.current.value || 0,
                    junho: junho.current.value || 0,
                    julho: julho.current.value || 0,
                    agosto: agosto.current.value || 0,
                    setembro: setembro.current.value || 0,
                    outubro: outubro.current.value || 0,
                    novembro: novembro.current.value || 0,
                    dezembro: dezembro.current.value || 0,
                },
                usuario: usuario,
                empresa: empresa
            }
            if(ok){
                fetch(`http://localhost:5000/faturamento/${empresa}/${ano}`,{
                    mode: 'cors',
                    credentials: 'include',
                    method: "PUT",
                    headers:{
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(valores)
                })
                .then(res => {
                    if (!res.ok) {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = res.msg;
                    }
                    return res.json();
                })
                .then(res => {
                    if (res) {
                        router.push("/admin/faturamento");
                    } else {
                        msgRef.current.className = "msgError";
                        msgRef.current.innerHTML = res.msg;
                    }
                })
            }
            else{
                msgRef.current.className = "msgError";
                msgRef.current.innerHTML = res.msg;
            }  
        }
        else
        {
            msgRef.current.className = "msgError";
            msgRef.current.innerHTML = "Preencha todos os campos";
        }
    }
 
    return (
        <div className="container mt-4">
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h2 className="card-title m-0">{isAlteracao ? "Alterar Faturamento" : "Cadastrar Faturamento"}</h2>
            </div>
            <div ref={msgRef}>

            </div>
            <div className="card-body">
                <div className="form-group mb-3">
                    <label htmlFor="ano">Ano</label>
                    <input type="number" readOnly={isAlteracao} defaultValue={faturamento[0]?.ano} ref={ano} className={`form-control ${erroAno ? 'is-invalid' : ''}`} onChange={() => setErroAno(false)} id="ano" placeholder="Digite o ano" required/>
                </div>
                <div className="row">
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="janeiro">Janeiro</label>
                        <input type="number" defaultValue={faturamento[0]?.valor} ref={janeiro} className="form-control" id="janeiro" placeholder="Valor de Janeiro"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="fevereiro">Fevereiro</label>
                        <input type="number" defaultValue={faturamento[1]?.valor} ref={fevereiro} className="form-control" id="fevereiro" placeholder="Valor de Fevereiro"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="marco">Março</label>
                        <input type="number" defaultValue={faturamento[2]?.valor} ref={marco} className="form-control" id="marco" placeholder="Valor de Março"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="abril">Abril</label>
                        <input type="number" defaultValue={faturamento[3]?.valor} ref={abril} className="form-control" id="abril" placeholder="Valor de Abril"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="maio">Maio</label>
                        <input type="number" defaultValue={faturamento[4]?.valor} ref={maio} className="form-control" id="maio" placeholder="Valor de Maio"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="junho">Junho</label>
                        <input type="number" defaultValue={faturamento[5]?.valor} ref={junho} className="form-control" id="junho" placeholder="Valor de Junho"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="julho">Julho</label>
                        <input type="number" defaultValue={faturamento[6]?.valor} ref={julho} className="form-control" id="julho" placeholder="Valor de Julho"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="agosto">Agosto</label>
                        <input type="number" defaultValue={faturamento[7]?.valor} ref={agosto} className="form-control" id="agosto" placeholder="Valor de Agosto"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="setembro">Setembro</label>
                        <input type="number" defaultValue={faturamento[8]?.valor} ref={setembro} className="form-control" id="setembro" placeholder="Valor de Setembro"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="outubro">Outubro</label>
                        <input type="number" defaultValue={faturamento[9]?.valor} ref={outubro} className="form-control" id="outubro" placeholder="Valor de Outubro"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="novembro">Novembro</label>
                        <input type="number" defaultValue={faturamento[10]?.valor} ref={novembro} className="form-control" id="novembro" placeholder="Valor de Novembro"/>
                    </div>
                    <div className="col-md-4 form-group mb-3">
                        <label htmlFor="dezembro">Dezembro</label>
                        <input type="number" defaultValue={faturamento[11]?.valor} ref={dezembro} className="form-control" id="dezembro" placeholder="Valor de Dezembro"/>
                    </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <button type="submit" className="btn btn-primary" onClick={() => isAlteracao ? alterar(empresa, ano.current.value) : gravar()}>Cadastrar</button>
                    <Link type="button" className="btn btn-secondary" href="/admin/faturamento">Voltar</Link>
                </div>
            </div>
        </div>
    </div>
    );
}