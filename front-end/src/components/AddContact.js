import { Box, Icon, Input } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import { useState } from "react";
import { addContact } from "../utils/api";
import toast from "react-hot-toast";

export default function AddContact() {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleAddContact = (user) => {
        addContact({
            userId: JSON.parse(localStorage.getItem('userdata')).id,
            contactId: user
        }).then((res) => {
            res && toast.success(`Adding contact successful: ${user}!`);
        });
    }

    const handleSendMessage = () => {
        console.log('Send Message');
    }

    return(
        <Box width="100%" style={{display:"flex", alignItems:"center", justifyContent:"space-around", padding:"0 10px"}}>
            <Input placeholder="Enter Contact Name" value={value} onChange={(e) => handleChange(e)} />
            <Box style={{display:"flex", alignItems:"center", justifyContent:"space-around", width:"70px"}}>
                <Icon onClick={() => handleAddContact(value)} >add_circle</Icon>
                <MessageIcon onClick={() => handleSendMessage()} />
            </Box>
        </Box>
    )
}