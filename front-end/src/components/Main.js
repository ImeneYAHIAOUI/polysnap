import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Paper } from "@mui/material"
import UserHeader from './UserHeader';
import ChatList from './ChatList';
import AddContact from './AddContact';
import Chat from './Chat';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function Main(){
    return(
        <Grid container spacing={3} style={{ height: '100%'}}>
            <Grid item xs={2.5} style={{ height: '100%'}}>
                <Grid item style={{ height: '10%'}}>
                    <Item style={{ height: '100%'}} xs={12} >
                        <UserHeader />
                    </Item>
                </Grid>
                <Grid item style={{ height: '85%'}}>
                    <Item style={{ height: '100%'}} xs={12} >
                        <ChatList />
                    </Item>
                </Grid>
                <Grid item style={{ height: '5%'}}>
                    <Item style={{ height: '100%'}} xs={12} >
                        <AddContact />
                    </Item>
                </Grid>
            </Grid>
            <Grid item xs={9.5} >
                <Item style={{ height: '100%'}} >
                    <Chat />
                </Item>
            </Grid>
        </Grid>
    )
}