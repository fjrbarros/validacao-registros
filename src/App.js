import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { ToastContainer, toast } from 'react-toastify';
import { recuperaToken, validaRegistro, handleClickBtnCsv } from './util/request';
import 'react-toastify/dist/ReactToastify.css';
import { columns } from './util/columns';
import TopBar from './Components/topbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import validaForm from './util/validaForm';
import UploadFile from './Components/uploadfile';
import Box from '@material-ui/core/Box';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(() => ({
  form: {
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    '@media(max-width:915px)': {
      flexDirection: 'column'
    }
  },

  input: {
    marginRight: '15px',
    '@media(max-width:915px)': {
      width: '100%',
      marginRight: '0',
      marginTop: '10px'
    }
  },

  containerButtons: {
    '@media(max-width:915px)': {
      marginTop: '10px'
    }
  },

  buttonValidar: {
    marginRight: '10px'
  }
}));

function getDefaultValues() {
  return {
    consumerKey: '',
    consumerSecret: '',
    tipoInscricao: '',
    nomeArquivo: '',
    dadosArquivo: []
  }
}

export default function ButtonAppBar() {
  const classes = useStyles();
  const [values, setValues] = useState(getDefaultValues);
  const [errors, setErrors] = useState(getDefaultValues);
  const [disabled, setDisabled] = useState(false);
  const [dadosTabela, setDadosTabela] = useState([]);

  function handleChange(event) {
    event.preventDefault();

    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      setValues({ ...values, [event.target.name]: event.target.value });
      return;
    }

    const fileReader = new FileReader();

    fileReader.onloadend = fileResult => setValues({ ...values, nomeArquivo: file.name, dadosArquivo: fileResult.target.result.split('\r\n') });

    fileReader.readAsText(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = {};

    validaForm(values, (campo, msg) => errors[campo] = msg);

    setErrors(errors);

    if (Object.keys(errors).length !== 0) return;

    setDisabled(true);
    setDadosTabela([]);
    executaValidacao();
  }

  async function executaValidacao() {
    const token = await recuperaToken(values);

    if (!token) {
      toast.error('Erro ao recuperar Token de acesso!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false
      });
      setDisabled(false);
      return;
    }

    for (const registro of values.dadosArquivo) {
      if (registro?.trim().length) {
        const houveErro = await validaRegistro(registro, token, setDadosTabela, values);
        if (houveErro) break;
      }
    }

    setDisabled(false);
  }

  return <>
    <TopBar text='Validador de inscrição' />
    <form
      noValidate
      autoComplete='off'
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <TextField
        className={classes.input}
        label='Consumer key'
        name='consumerKey'
        value={values.consumerKey}
        onChange={handleChange}
        error={!!errors.consumerKey}
        helperText={errors.consumerKey}
        disabled={disabled}
      />
      <TextField
        className={classes.input}
        label='Consumer secret'
        name='consumerSecret'
        value={values.consumerSecret}
        onChange={handleChange}
        error={!!errors.consumerSecret}
        helperText={errors.consumerSecret}
        disabled={disabled}
      />
      <FormControl
        style={{ minWidth: '150px', marginTop: !!errors.tipoInscricao ? 0 : 3 }}
        className={classes.input}
        error={!!errors.tipoInscricao}
      >
        <InputLabel>Tipo inscriçao</InputLabel>
        <Select
          name='tipoInscricao'
          value={values.tipoInscricao}
          onChange={handleChange}
          disabled={disabled}
        >
          <MenuItem value='CPF'>CPF</MenuItem>
          <MenuItem value='CNPJ'>CNPJ</MenuItem>
        </Select>
        <FormHelperText>{errors.tipoInscricao}</FormHelperText>
      </FormControl>
      <UploadFile
        style={{ minWidth: '240px' }}
        label='Selecione um arquivo (txt)'
        value={values.nomeArquivo}
        className={classes.input}
        name='nomeArquivo'
        errorText={errors.nomeArquivo}
        accept='.txt'
        onChange={handleChange}
      />
      <Box className={classes.containerButtons}>
        <Button
          variant='contained'
          color='primary'
          className={classes.buttonValidar}
          startIcon={<PlaylistAddCheckIcon />}
          type='submit'
          disabled={disabled}
        >
          Validar
        </Button>
        <Button
          variant='contained'
          color='primary'
          startIcon={<GetAppIcon />}
          onClick={() => handleClickBtnCsv(dadosTabela)}
        >
          CSV
        </Button>
      </Box>
    </form>
    <DataGrid
      style={{ height: 'calc(100vh - 140px)', margin: '0px 10px' }}
      rows={dadosTabela}
      columns={columns}
      disableSelectionOnClick
      hideFooterPagination
      disableColumnMenu
      disableColumnResize
      loading={disabled}
      hideFooter
      localeText={{ noRowsLabel: 'Sem dados' }}
    />
    <ToastContainer />
  </>;
}