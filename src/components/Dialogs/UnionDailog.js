import * as React from 'react';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ParameterTextField from './ParameterTextField';
import ParameterSelector from './ParameterSelector';
import {Select, InputLabel,TextField} from '@mui/material';
import { AppBar, Box, Container, Grid, Paper, Toolbar, Snackbar } from '@mui/material';
import { makeStyles  } from 'tss-react/mui';
import Result from './../sheetUnion';
import CustomLeftTree from '../UnionView/CustomLeftTree';
import CustomRightTree from '../UnionView/CustomRightTree';
import UnionCodeView from '../UnionView/UnionCodeView';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useDispatch } from 'react-redux';
import {setUnionGlobalType} from '../../slices/union'
import ExpandIcon from '@mui/icons-material/PlaylistPlay';
import WifiIcon from '@mui/icons-material/PlayCircleOutline';
import { runQuery } from '../../slices/union';
import { Oval } from  'react-loader-spinner';
import Modal from '../../components/Dialogs/Modal';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles()((theme) => {
  return {
    boxStyle: {
      borderBottom: '1px solid #aaa',
    },
    largeBoxStyle:{
        border: '1px solid #aaa'
    },
    listBoxStyle: {
      border: '1px solid #ccc',
      borderRight: '1px solid #aaa',
      borderLeft:'none', 
      borderTop:'none', 
      maxHeight: 250
    },
    searchStyle: {
      marginBottom: 8,
      fontSize: 12,
      width: '100%',
      '& MuiSvgIcon-root': {
        width: 16
      }
    },
    fieldBoxStyle: {
      display: 'flex',
    },
    iconStyle: {
      margin:4,
      marginRight: 4,
      color: '#1976d2',
      width: 16
    },
    fontRadioSize: {
      "& span:last-child": {
          fontSize:10
      }
    }
  };
})

const CustomInputLabel = styled(InputLabel)(({theme}) => ({
  fontSize:15,
  marginTop:12,
}));

export default function UnionDialog({ open, handleCloseUnionDialog, SaveView, queryName}) {
  const [openModal, setOpenModal] = React.useState(false);
  const {classes} = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [unionType, setUnionType] = React.useState('UNION ALL');
  const codeSQL = useSelector(state => state.union.codeSQL);
  const dispatch = useDispatch();

  const handleUnionTypeChange = (event) => {
    setUnionType(event.target.value);
    console.log(event.target.value);
    dispatch(setUnionGlobalType({unionType:event.target.value}));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    handleCloseUnionDialog();
  }

  const handleRun = () => {
    let query = codeSQL;
    const queryInfo= {
      query: query
    }

    dispatch(runQuery(queryInfo))
    .then(data => {
      setIsLoading(false);
    })
    .catch(err => {
      setOpenModal(true);
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} disableRestoreFocus PaperProps={{  style: { minWidth: 1300} }}> 
        <Modal open={openModal} param={{title: 'Failed', content: 'An error occured!'}} handleClose={handleCloseModal}/>
        <DialogTitle  sx={{padding: '16px 48px',borderBottom: '1px', fontSize:'27px', display:'flex', justifyContent:'space-between'}}>Build Union
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseUnionDialog}
          >
            <CloseIcon />
          </IconButton>        
        </DialogTitle>
        <DialogContent sx={{paddingBottom: '45px'}}> 
          <Box>
             {isLoading && 
                <div className={classes.loadingBox}>
                  <div className={classes.loadingContent}>
                    <Oval
                      height={50}
                      width={50}
                      color="#2761c7"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel='oval-loading'
                      secondaryColor="#2761c7"
                      strokeWidth={3}
                      strokeWidthSecondary={3}
                    />
                  </div>
                </div>
              }
              <Container spacing={0} sx={{marginBotom: 0, padding: 0}} maxWidth={'1920'} minHeight={'1000'}>
                <Box sx={{marginBottom:1, display:"flex", alignItems:'center'}}>
                  <Button onClick={handleRun} size="small" sx={{paddingLeft: '15px',  height:'24.25px',fontSize: 12, borderColor: '#CCCCCC', color: 'gray', paddingRight: '15px', display: 'flex', justifyContent: 'space-between'}} color = 'inherit' variant="outlined"   ><WifiIcon sx={{marginRight: '10px'}} fontSize= 'small' />Run</Button>
                  <FormControl sx={{marginLeft: 4}}>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={unionType}
                      onChange={handleUnionTypeChange}
                    >
                      <FormControlLabel 
                        value="UNION ALL"  
                        className={classes.fontSize} 
                        control={
                          <Radio sx={{'& .MuiSvgIcon-root': {fontSize: 15,},}}/>
                        } 
                        label={
                          <Typography variant="body2" color="textSecondary">UNION ALL</Typography>
                        }
                      />
                      <FormControlLabel 
                        value="UNION" 
                        control={
                          <Radio sx={{'& .MuiSvgIcon-root': { fontSize: 15}}}/>
                        } 
                        label={
                          <Typography variant="body2" color="textSecondary">UNION</Typography>
                        } 
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box className={classes.largeBoxStyle}>
                  <Grid container style={{ minHeight: 250 }}>
                    <Grid item md={3} className={classes.listBoxStyle}>
                      <CustomLeftTree queryName={queryName}/>
                    </Grid>
                    <Grid item md={3} className={classes.listBoxStyle}>
                       <CustomRightTree queryName={queryName}/>                                    
                    </Grid>
                    <Grid item md={6} className={classes.listBoxStyle}>
                      <UnionCodeView />
                    </Grid>
                  </Grid>
                  <Result sx={{position: 'fixed', bottom: 0}}/>
                </Box>
            </Container>
          </Box>
        </DialogContent>
    </Dialog>
  );
}


