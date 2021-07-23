import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1
    },

    toolbar: {
        background: 'linear-gradient(to right, #6051e6 6%, #5966e7 25%, #4f81e9 55%, #499bea 69%, #43a5eb 83%, #3bbeec 99%)'
    },

    title: {
        flexGrow: 1,
        textAlign: 'center',
    }
}));

export default function TopBar({ text }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position='static' >
                <Toolbar className={classes.toolbar}>
                    <Typography variant='h6' className={classes.title}>
                        {text}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}