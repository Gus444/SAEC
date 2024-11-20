'use client'
import Link from "next/link";

export default function MontaTabela(props) {
    // Verifica se os cabeçalhos e propriedades foram passados
    let cabecalho = props.cabecalhos || [];
    let propriedades = props.propriedades || [];

    // Se os cabeçalhos e propriedades não foram passados, usa as propriedades do primeiro item da lista
    if (props.lista.length > 0 && cabecalho.length === 0) {
        cabecalho = Object.keys(props.lista[0]);
    }

    if (props.lista.length > 0 && propriedades.length === 0) {
        propriedades = Object.keys(props.lista[0]);
    }

    // Adiciona a coluna "Ações" automaticamente
    if (!propriedades.includes("Ações")) {
        propriedades.push("Ações");
    }

    if (!cabecalho.includes("Ações")) {
        cabecalho.push("Ações");
    }

    // Verifica se props.lista é um array
    const lista = Array.isArray(props.lista) ? props.lista : [];

    return (
        <div className="container mt-1">
            <div className="card p-3 shadow">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                {cabecalho.map((value, index) => (
                                    <th key={index}>{value.includes("|") ? value.split("|")[0] : value}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                        {props.lista.map((value, index) => (
                            <tr key={index}>
                                {props.propriedades.map((prop, index) => {
                                    console.log(`Valor de ${prop}:`, value[prop]); // Adicione esta linha para verificar o valor
                                    if (prop !== "Ações") {
                                        return <td key={index}>{value[prop]}</td>;
                                    } else {
                                        return (
                                            <td key={index}>
                                                <div>
                                                    <Link href={props.alteracao + `/${value[props.propriedades[0]]}`} title="ALTERAR" className="btn btn-primary mr-2 mb-2">
                                                        <i className="fas fa-pen"></i>
                                                    </Link>
                                                    <button onClick={() => props.exclusao(value[props.propriedades[0]])} title="EXCLUIR" className="btn btn-danger mr-2 mb-2">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                    <button onClick={() => props.acesso(value[props.propriedades[0]])} title="ACESSAR" className="btn btn-success mr-2 mb-2">
                                                        <i className="fas fa-share"></i>
                                                    </button>
                                                    <Link href={props.exibir + `/${value[props.propriedades[0]]}`} title="EXIBIR" className="btn btn-secondary mr-2 mb-2">
                                                        <i className="fa-solid fa-scroll"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}