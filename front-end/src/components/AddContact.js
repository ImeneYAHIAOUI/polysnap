import { Box, Button, Icon, Input } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';

export default function AddContact() {
    return(
        <Box width="100%" style={{display:"flex", alignItems:"center", justifyContent:"space-around", padding:"0 10px"}}>
            <Input placeholder="Add Contact" />
            <Box style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
                <Icon>add_circle</Icon>
                <MessageIcon />
            </Box>
        </Box>
    )
}