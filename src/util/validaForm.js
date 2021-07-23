export default function validaForm(values, errorFn) {
    const texto = 'Campo obrigatório!';

    if (!values.consumerKey.trim()) {
        errorFn('consumerKey', texto);
    }

    if (!values.consumerSecret.trim()) {
        errorFn('consumerSecret', texto);
    }

    if (!values.tipoInscricao.trim()) {
        errorFn('tipoInscricao', texto);
    }

    if (!values.dadosArquivo.length) {
        errorFn('nomeArquivo', texto);
    }
}