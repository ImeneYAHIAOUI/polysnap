import { Box, Icon, Input } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import { useState } from "react";

export default function AddContact({handleAddContact, handleSendMessage}) {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return(
        <Box width="100%" style={{display:"flex", alignItems:"center", justifyContent:"space-around", padding:"0 10px"}}>
            <Input placeholder="Enter Contact Name" value={value} onChange={(e) => handleChange(e)} />
            <Box style={{display:"flex", alignItems:"center", justifyContent:"space-around", width:"70px"}}>
                <Icon onClick={() => handleAddContact()} >add_circle</Icon>
                <MessageIcon onClick={() => handleSendMessage()} />
            </Box>
        </Box>
    )
}