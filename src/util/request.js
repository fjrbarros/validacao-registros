import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function validaRegistro(registro, token, setDadosTabela, values) {

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    const options = { method: 'GET', headers };

    const url = isCpf(values) ? 'consulta-cpf-df/v1/cpf/' : 'consulta-cnpj-df/v2/empresa/'

    const response = await fetch(`https://gateway.apiserpro.serpro.gov.br/${url}${registro}`, options);

    switch (response.status) {
        case 401:
            const token = await recuperaToken();
            if (token) {
                await validaRegistro(registro, token);
                return false;
            }
            toast.error('Erro ao recuperar Token de acesso!', { position: toast.POSITION.TOP_RIGHT, autoClose: false });
            return true;
        case 404:
            setDadosTabela(prevState => ([...prevState, { id: prevState.length + 1, registro: '', nome: '', situacao: `Registro <${registro}> inexistente!` }]));
            return false;
        case 400:
            const resp = await response.json();
            setDadosTabela(prevState => ([...prevState, { id: prevState.length + 1, registro: '', nome: '', situacao: resp.mensagem }]));
            return false;
        case 403:
        case 500:
        case 504:
            toast.error('Erro durante a requisição!', { position: toast.POSITION.TOP_RIGHT, autoClose: false });
            return true;
        default:
            const json = await response.json();
            const nome = isCpf(values) ? json.nome : json.nomeEmpresarial;
            const situacao = isCpf(values) ? json.situacao?.descricao : json.situacaoCadastral?.codigo;
            setDadosTabela(prevState => ([...prevState, { id: json.ni, registro: json.ni, nome: nome, situacao: situacao }]));
            return false;
    }
}

export async function recuperaToken(values) {
    const keyBase64 = btoa(`${values.consumerKey.trim()}:${values.consumerSecret.trim()}`);

    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${keyBase64}`
    });

    const options = { method: 'POST', headers, body: 'grant_type=client_credentials' };

    const response = await fetch('https://gateway.apiserpro.serpro.gov.br/token', options);
    const json = await response.json();

    return json.access_token;
}

function isCpf(values) {
    return values.tipoInscricao === 'CPF';
}

export function handleClickBtnCsv(dadosTabela) {
    if (!dadosTabela.length) return;

    let csv = 'Registro; Nome; Situação\n';

    dadosTabela.forEach(item => csv += `${item.registro}; ${item.nome}; ${item.situacao} \n`);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI('\uFEFF' + csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Validação_registros.csv';
    hiddenElement.click();
}