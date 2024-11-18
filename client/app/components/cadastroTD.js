import { useRef, useState } from "react";

export default function CadastroTipoDespesa({ onClose, onSave }) {
    const nomeRef = useRef(null);
    const [erroNome, setErroNome] = useState(false);

    const cadastrar = () => {
        const nomeValue = nomeRef.current.value;

        if (!nomeValue) {
            setErroNome(true);
            return;
        }

        // Chama a função `onSave` para salvar o novo tipo de despesa
        onSave(nomeValue);
        onClose(); // Fecha o modal ou popup
    };

    return (
        <div className="popup">
            <div className="popup-title">Cadastrar Tipo de Despesa</div>
            <div className="popup-content">
                <label>Nome:</label>
                <input
                    type="text"
                    ref={nomeRef}
                    className={`form-control ${erroNome ? "is-invalid" : ""}`}
                    onChange={() => setErroNome(false)}
                />
                {erroNome && <small className="text-danger">Preencha o nome.</small>}
            </div>
            <div className="popup-buttons">
                <button onClick={onClose} className="btn btn-danger">Cancelar</button>
                <button onClick={cadastrar} className="btn btn-primary">Salvar</button>
            </div>
        </div>
    );
}