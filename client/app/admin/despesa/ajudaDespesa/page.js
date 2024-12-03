

export default function ajudaDespesa(){

    
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Ajuda - Cadastrar Despesa</h1>
            <div>
                <section className="mb-4">
                    <h2 className="mb-2">Introdução</h2>
                    <p>
                        Esta página fornece instruções sobre como utilizar a funcionalidade de cadastro de despesas. 
                        Aqui, você aprenderá como preencher o formulário corretamente e quais ações você pode realizar.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="mb-2">Passo a Passo</h2>
                    <ol>
                        <li>
                            <strong>Informar ano, mês e data: </strong>
                            Nesta etapa é importante o usuario entender que a data sempre seguira o ano e mês preenchido anteriormente, ou seja,
                            se for informado ano 2024 e mês de Maio então a data seguira 01/05/2024, não podendo ser alterada após a primeira
                            inserção de uma despesa no grid.
                        </li>
                        <br></br>
                        <li>
                            <strong>Tipo de despesa e Protocolo: </strong>
                            O tipo de despesa é um item obrigatório a ser preenchido neste formulário, isso já não é verdade para o protocolo, sendo
                            possivel informar se achar necessário, ambos são trazidos de cadastros anteriores na aba de cadastro de tipo de despesa e
                            cadastro de protocolo.
                        </li>
                        <br></br>
                        <li>
                            <strong>Cadastro de tipo de despesa no formulario: </strong> Atravez do icone de <i className="fas fa-plus"></i> é possivel abrir
                            um campo de preenchimento para cadastrar mais tipos de despesa caso o usuário necessite cadastrar mais tipos
                        </li>
                        <br></br>
                        <li>
                            <strong>Adicionar ao grid: </strong>Após o preenchimento de todos os campos obrigatórios (ano, data, mês, tipo de despesa, descrição e valor)
                            hávera disponível um botão para adicionar a despesa em um grid abaixo, sendo possivel apenas incluir a despesa
                        </li>
                    </ol>
                </section>

                <section className="mb-4">
                    <h2 className="mb-2">Dicas</h2>
                    <ul>
                        <li>Certifique-se de preencher todos os campos obrigatórios para evitar erros.</li>
                        <li>Verifique se o valor da despesa está correto antes de salvar.</li>
                    </ul>
                </section>

                <section className="mb-4">
                    <h2 className="mb-2">Exemplo</h2>
                    <p>Abaixo está um exemplo de preenchimento:</p>
                    <ul>

                        <li><strong>Ano:</strong> 2024</li>
                        <li><strong>Mês:</strong> Novembro</li>
                        <li><strong>Data:</strong> 30/11/2024</li>
                        <li><strong>Tipo de Despesa:</strong> Transporte</li>
                        <li><strong>Protocolo:</strong> 52</li>
                        <li><strong>Descrição:</strong> Corrida de táxi</li>
                        <li><strong>Valor:</strong> R$ 45,00</li>
                        
                    </ul>
                </section>

                <section className="mb-4">
                    <h2 className="mb-2">Problemas Comuns</h2>
                    <ul>
                        <li><strong>Erro:</strong> Campo obrigatório não preenchido. <br /> 
                            <strong>Solução:</strong> Verifique se todos os campos obrigatórios estão preenchidos.
                        </li>
                        <li><strong>Erro:</strong> Tipo de despesa não cadastrado. <br /> 
                            <strong>Solução:</strong> Use o botão <i className="fas fa-plus"></i> para adicionar um novo tipo.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );

}