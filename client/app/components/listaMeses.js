import Link from "next/link";

export default function ListaMeses(props) {
    let cabecalho = props.cabecalhos || [];
    let propriedades = props.propriedades || [];

    if (props.lista.length > 0 && cabecalho.length === 0) {
        cabecalho = Object.keys(props.lista[0]);
    }

    if (props.lista.length > 0 && propriedades.length === 0) {
        propriedades = Object.keys(props.lista[0]);
    }

    if (!propriedades.includes("Ações")) {
        propriedades.push("Ações");
    }

    if (!cabecalho.includes("Ações")) {
        cabecalho.push("Ações");
    }

    return (
        <div className="container mt-1">
            <div className="card p-4 shadow">
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
                                    {propriedades.map((prop, index) => {
                                    if (prop !== "Ações") {
                                        const nestedProps = prop.split(".");
                                        let cellValue = value;
                                        nestedProps.forEach(nestedProp => {
                                            cellValue = cellValue ? cellValue[nestedProp] : null;
                                        });

                                        return <td key={index}>{cellValue !== null && cellValue !== undefined ? cellValue : ""}</td>;
                                    } else {
                                        const idExclusao = props.campoExclusao ? value[props.campoExclusao] : value[propriedades[0]];
                                        return (
                                            <td key={index}>
                                                <div>
                                                    <Link href={props.alteracao + `/${idExclusao}`} title="ALTERAR" className="btn btn-primary mr-2 mb-2">
                                                        <i className="fas fa-pen"></i>
                                                    </Link>
                                                    <button onClick={() => props.exclusao(idExclusao)} title="EXCLUIR" className="btn btn-danger mr-2 mb-2">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
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