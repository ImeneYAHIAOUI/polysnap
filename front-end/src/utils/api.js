import axios from 'axios';
import toast from 'react-hot-toast';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL;

axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';

const config = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    }
}

export const login = async (data,verify) => {
    try{
        const res = await axios.get(`${USER_SERVICE_URL}/users/lookup?${data}`,config);
        !verify && toast.success(`Logging successful: Welcome ${res.data.username}!`);
        window.localStorage.setItem('user',res.data.username);
        return res.data;
    }catch(err){
        toast.error(`Logging unsuccessful: ${err.message}`);
        window.localStorage.removeItem('user');
        return null;
    }
}

export const register = async (data) => {
    try{
        const res = await axios.post(`${USER_SERVICE_URL}/users/signup`, data);
        toast.success(`Registration successful: Welcome ${res.data.username}!`);
        window.localStorage.setItem('user',res.data.username);
        return res.data;
    }catch(err){
        toast.error(`Registration unsuccessful: ${err.message}`);
        window.localStorage.removeItem('user');
        return null;
    }
}

export const addContact = async (data) => {
    try{

    }catch(err){
        
    }
}