'use client'
import { useEffect, useState } from "react";


export default function ExibirEmpresa({ params: { id } }) {
 
    let [empresa, setEmpresa] = useState([]);

    useEffect((e) => {
        carregarEmpresa();
    }, [])

    function carregarEmpresa() {
        fetch(`http://localhost:5000/empresa/obter/${id}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> {
            return r.json()
        })
        .then(r=> {
            setEmpresa(r);
        })
    }


    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Registro de empresa</h2>
            <table className="table table-hover table-striped">
                <tbody>
                    <tr>
                        <th className="table-primary"><i className="fa fa-id-card"></i> Identificador</th>
                        <td>{empresa.empId || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-building"></i> CNPJ</th>
                        <td>{empresa.empCnpj || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-user"></i> Nome/Razão social</th>
                        <td>{empresa.empNome || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-file-alt"></i> Regime</th>
                        <td>{empresa.empRegime || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-certificate"></i> Inscrição Estadual</th>
                        <td>{empresa.empIe || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-phone"></i> Telefone</th>
                        <td>{empresa.empTelefone || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-user-tie"></i> Proprietário</th>
                        <td>{empresa.empProprietario || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-user-check"></i> Responsável</th>
                        <td>{empresa.empResponsavel || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-calendar-alt"></i> Início de serviço</th>
                        <td>{empresa.empInicio || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-calendar-alt"></i> Fim de serviço</th>
                        <td>{empresa.empFim || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-envelope"></i> Email</th>
                        <td>{empresa.empEmail || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-map-marker-alt"></i> Endereço</th>
                        <td>{empresa.empEndereco || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-map-pin"></i> Bairro</th>
                        <td>{empresa.empBairro || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-city"></i> Cidade</th>
                        <td>{empresa.empCidade || "Não possui"}</td>
                    </tr>
                    <tr>
                        <th className="table-primary"><i className="fa fa-mail-bulk"></i> CEP</th>
                        <td>{empresa.empCep || "Não possui"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}