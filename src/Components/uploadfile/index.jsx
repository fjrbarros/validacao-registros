import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
    label: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export default function UploadFile(props) {
    const { onChange, label, accept, className, errorText, name, value, ...rest } = props;
    const classes = useStyles();

    return (
        <label
            htmlFor='upload-file'
            className={`${classes.label} ${className}`}
            {...rest}
        >
            <input
                accept={accept}
                style={{ display: 'none' }}
                id='upload-file'
                name={name}
                type='file'
                onChange={onChange}
            />
            <TextField
                disabled
                style={{ flex: 1 }}
                label={label}
                value={value}
                error={!!errorText}
                helperText={errorText}
            />
            <IconButton color='primary' component='span' >
                <AttachFileIcon />
            </IconButton>
        </label>
    );
}