import '../../public/template/css/loading.css'

export default function Loading() {
    return (
        <div className="loading">
            <p>Carregando...</p>
            <div class="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
        </div>
    );
}