

export default function ajudaDespesa(){

    
    return (
        <div className="container form-despesa">
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
                    <table className="table">
                        <thead>
                            <tr>
                            <th>Ano</th>
                            <th>Mês</th>
                            <th>Data</th>
                            <th>Tipo de Despesa</th>
                            <th>Protocolo</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>2024</td>
                            <td>Novembro</td>
                            <td>30/11/2024</td>
                            <td>Transporte</td>
                            <td>52</td>
                            <td>Corrida de táxi</td>
                            <td>R$ 45,00</td>
                            </tr>
                        </tbody>
                        </table>
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

                <br></br>
                <section className="mb-4">
                    <h1 className="mb-2">Para cadastrar</h1><br></br>
                    
                    <div className="mb-4">
                        <h3>Passo 1: Clique no botão "Cadastrar Despesa"</h3>
                        <img 
                            alt="Botão de cadastrar despesa" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/ajudaDespesaCadastro.png" 
                        />
                        <p className="text-muted">Clique no botão destacado na imagem para abrir o formulário de cadastro de despesas.</p>
                    </div>

                    <div>
                        <h3>Passo 2: Preencha a tela de cadastro</h3>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/telaCadastro.png" 
                        />
                        <p className="text-muted">Complete os campos obrigatórios como Tipo de Despesa, Ano, Mês, Data, Valor, e Descrição antes de adicionar ao grid no botão <button className="btn btn-success mb-4">Adicionar</button></p>
                    </div>

                    <div>
                        <h3>Passo 3: Grid preenchdio e Salvar</h3>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/gridPreenchido.png" 
                        />
                        <p className="text-muted">Após preencher todos os campos e adicionar ao grid o usuário pode cadastrar essa depesa clicando no botão <button className="btn btn-primary">Cadastrar</button>, mas caso queira adicionar mais registros basta repetir o passo anterior</p>
                    </div>

                    <div>
                        <h3>Passo 4: Lista de despesas cadastradas</h3>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaDespesa.png" 
                        /><hr></hr>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaDespesaMes.png" 
                        />
                        <hr></hr>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaDespesaEspecifica.png" 
                        />
                        <p className="text-muted">Ao clicar em cadastrar, a depesa cadastrada será listada por ano com o valor total do ano e tambem para mês, para vizualizar cada nivel apenas clicar em <button className="btn btn-primary mr-2 mb-2"><i className="fas fa-pen"></i></button> </p>
                    </div>
                </section>

                <br></br>
                <section className="mb-4">
                    <h1 className="mb-2">Para alterar</h1><br></br>
                    
                    <div className="mb-4">
                        <h3>Passo 1: clique no icone <button className="btn btn-primary mr-2 mb-2"><i className="fas fa-pen"></i></button> </h3>
                        <img 
                            alt="Botão de cadastrar despesa" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaAlterarAnos.png" 
                        />
                        <hr></hr>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaAlterarMeses.png" 
                        />
                        <hr></hr>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaDespesaEspecificaAlterar.png" 
                        />
                        <hr></hr>
                        <img 
                            alt="Tela de cadastro de despesas" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/alterarDespesaEspecifica.png" 
                        />
                       <p className="text-muted">Prossiga clicando nos icones destacados na imagem até encontrar a despesa que deseja alterar, <button className="btn btn-primary mr-2 mb-2"><i className="fas fa-pen"></i></button></p>
                    </div>

                </section>

                <section className="mb-4">
                    <h1 className="mb-2">Para excluir</h1><br></br>
                    
                    <div className="mb-4">
                        <h3>Passo 1: clique no icone <button className="btn btn-primary mr-2 mb-2"><i className="fas fa-pen"></i></button> </h3>
                        <img 
                            alt="Botão de cadastrar despesa" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaAlterarAnos.png" 
                        />
                    </div>

                    <div className="mb-4">
                        <h3>Passo 2: Excluir Mês </h3>
                        <img 
                            alt="Botão de cadastrar despesa" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/listaAlterarMeses.png" 
                        />
                        <p>Caso deseje excluir um mês cadastrado anteriormente, apenas clicar em <button className="btn btn-danger mr-2 mb-2"><i className="fas fa-trash"></i></button>, isso fara com que
                        todos os lançamentos deste mês sejam apagados</p>
                    </div>

                    <div className="mb-4">
                        <h3>Passo 3: Excluir despesa especifica</h3>
                        <img 
                            alt="Botão de cadastrar despesa" 
                            style={{ width: '900px', height: 'auto', border: '1px solid #ccc', borderRadius: '8px' }} 
                            src="/img/ajudaDespesaImg/apagarDespesaEspecifica.png" 
                        />
                        <p>Caso deseje excluir um laçamento efetuado em algum mês especifico, apenas clicar no icone destacado na imagem, <button className="btn btn-danger mr-2 mb-2"><i className="fas fa-trash"></i></button></p>
                    </div>
                
                </section>
            </div>
        </div>
    );

}