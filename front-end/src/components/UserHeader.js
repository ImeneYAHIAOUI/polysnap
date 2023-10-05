import { Box, Title } from "@mui/material"
import Avatar from "@mui/material/Avatar"

export default function UserHeader({username}){
    return(
        <Box style={{padding:"10px", display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
            <Avatar>OP</Avatar>
            <h3 style={{margin:"10px"}}>OP</h3>
        </Box>
    )
}