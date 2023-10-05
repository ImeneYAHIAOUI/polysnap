
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
    const { index, style } = props;
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`Item ${index + 1}`} />
        </ListItemButton>
      </ListItem>
    );
  }

export default function ChatList(){
    return(
        <>
            <FixedSizeList
                height={740}
                itemSize={46}
                itemCount={200}
                overscanCount={5}
            >
            {renderRow}
            </FixedSizeList>
        </>
    )
}