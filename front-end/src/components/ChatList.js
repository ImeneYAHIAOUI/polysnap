
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  thinScrollbar: {
    scrollbarWidth: 'thin', /* For Firefox */
    scrollbarColor: '#888 transparent', /* For Firefox */
    '&::-webkit-scrollbar': {
      width: '5px', /* Adjust the width as needed */
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888', /* Color of the scrollbar thumb */
      borderRadius: '10px', /* Radius of the scrollbar thumb */
    },
  },
}));

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
  
  const classes = useStyles();
  
    return(
        <div className={classes.thinScrollbar}>
            <FixedSizeList
                height={740}
                itemSize={46}
                itemCount={200}
                overscanCount={5}
            >
            {renderRow}
            </FixedSizeList>
        </div>
    )
}