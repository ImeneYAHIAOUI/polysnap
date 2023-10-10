
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, Button, Modal, Typography, LinearProgress, Input } from '@mui/material';
import { CardMedia } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Fragment, useState } from 'react';


import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import toast from 'react-hot-toast';


const useStyles = makeStyles((theme) => ({
  thinScrollbar: {
    scrollbarWidth: 'thin', /* For Firefox */
    scrollbarColor: '#888 transparent', /* For Firefox */
    '&::-webkit-scrollbar': {
      width: '2px', /* Adjust the width as needed */
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888', /* Color of the scrollbar thumb */
      borderRadius: '10px', /* Radius of the scrollbar thumb */
    },
  },
}));

const styleUpload = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '1px solid grey',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 24,
    p: 1,
  };

  const styleStory = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '1px solid grey',
    boxShadow: 24,
    p: 1,
  };

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </Box>
    );
  }

export default function StoriesList({ stories }) {
    const classes = useStyles();

    // Upload Story Modal state
    const [openUpload, setOpenUpload] = useState(false);
    const handleOpenUpload = () => setOpenUpload(true);
    const handleCloseUpload = () => setOpenUpload(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log(selectedFile);
        // You can now work with the selected file.
        if(selectedFile && !selectedFile.type.startsWith('image/') &&
        !selectedFile.type.startsWith('video/')){
            toast.error("Invalid file type");
            event.target.value = null;
        }
    };




    // Show story Modal state
    const [openStory, setOpenStory] = useState(false);
    const handleOpenStory = () => setOpenStory(true);
    const handleCloseStory = () => setOpenStory(false);

    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => 
        (prevActiveStep + 1 === currentUserStories.length) ? 
        0 :
        prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => 
        (prevActiveStep - 1 === -1) ? 
        currentUserStories.length - 1 : 
        prevActiveStep - 1);
    };

    const [currentUserStories, setCurrentUserStories] = useState([{}]);
    const [currentStory, setCurrentStory] = useState({
        username: "OP",
        url:"https://t4.ftcdn.net/jpg/04/43/11/25/360_F_443112508_yYeF5kptk2P6wDyt2Biw9WUDvpmI9Eav.jpg",
        progress: 1
    });

    return(
        <Fragment>
            {/* Upload Story Modal */}
            <Modal
                open={openUpload}
                onClose={handleCloseUpload}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={styleUpload}>
                    <Typography id="modal-modal-title" variant="subtitle1" component="h2">
                    Upload Story
                    </Typography>
                <Box style={{ display:"flex", }}>
                <Input
                    type="file"
                    onChange={handleFileChange}
                    hidden
                />
                <Button
                    component="label"
                    variant="contained"
                    minWidth="10px"
                >
                Upload
                </Button>
                </Box>
                </Box>
            </Modal>


            {/* View Story Modal */}
            <Modal
                open={openStory}
                onClose={handleCloseStory}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={styleStory}>
                    <LinearProgressWithLabel value={(currentStory.progress/currentUserStories.length)*100} />
                    <CardMedia
                        component="video"
                        height="300"
                        src={currentStory.url}
                    />
                    <MobileStepper
                    variant="dots"
                    steps={currentUserStories.length}
                    position="static"
                    activeStep={activeStep}
                    sx={{ maxWidth: 400, flexGrow: 1 }}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                        </Button>
                    }
                    />
                </Box>
            </Modal>


        <div className={classes.thinScrollbar}>
            <Box style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Typography variant="h6" style={{paddingLeft:"10px"}}>Stories &nbsp;</Typography>
                <Button
                    size='large'
                    style={{ width:"1px", minWidth:"0px"}}
                    color="success"
                    endIcon={<AddIcon />}
                    onClick={handleOpenUpload}
                >
                </Button>
            </Box>
            {
                stories.map((story, index) => {
                    return(
                        <ListItem key={index} component="div" disablePadding>
                            <ListItemButton style={{ display:"flex", flexDirection:"column"}} 
                                onClick={(story)=>handleOpenStory(story)}
                            >
                                <Avatar>{story.username[0]}</Avatar>
                                <ListItemText primary={story.username} />
                            </ListItemButton>
                        </ListItem>
                    )
                })
            }
        </div>
        </Fragment>
    )
}