import axios from "axios";
import toast from "react-hot-toast";

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL;
const STORY_SERVICE_URL = process.env.REACT_APP_STORY_SERVICE_URL;
const CHAT_SERVICE_URL = process.env.REACT_APP_CHATS_SERVICE_URL;
const MESSAGES_SERVICE_URL = process.env.REACT_APP_MESSAGES_SERVICE_URL;
const MEDIA_SERVICE_URL = process.env.REACT_APP_MEDIA_SERVICE_URL;

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Access-Control-Allow-Headers"] =
  "Origin, X-Requested-With, Content-Type, Accept";

const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
};

export const login = async (data, verify) => {
  try {
    const res = await axios.get(`${USER_SERVICE_URL}/lookup?${data}`, config);
    !verify &&
      toast.success(`Logging successful: Welcome ${res.data.username}!`);
    console.log(res.data);
    window.localStorage.setItem("userdata", JSON.stringify(res.data));
    window.localStorage.setItem("user", res.data.username);
    return res.data;
  } catch (err) {
    toast.error(`Logging unsuccessful: ${err.message}`);
    window.localStorage.removeItem("user");
    return null;
  }
};

export const lookup = async (id) => {
  try{
    const res = await axios.get(`${USER_SERVICE_URL}/lookup?id=${id}`, config);
    return res.data;
  }catch(err){
    toast.error(`Lookup unsuccessful: ${err.message}`);
    return null;
  }
}

export const register = async (data) => {
  try {
    const res = await axios.post(`${USER_SERVICE_URL}/signup`, data);
    toast.success(`Registration successful: Welcome ${res.data.username}!`);
    window.localStorage.setItem("userdata", JSON.stringify(res.data));
    window.localStorage.setItem("user", res.data.username);
    return res.data;
  } catch (err) {
    toast.error(`Registration unsuccessful: ${err.message}`);
    window.localStorage.removeItem("user");
    return null;
  }
};

export const addContact = async (data) => {
  try {
    const res = await axios.patch(`${USER_SERVICE_URL}/contacts`, data, config);
    toast.success(`Adding contact successful: ${res.data.username}!`);
    return res.data;
  } catch (err) {
    toast.error(`Adding contact unsuccessful: ${err.message}`);
    return null;
  }
};

export const fetchContactStories = async (data) => {
  try {
    const res = await axios.get(
      `${STORY_SERVICE_URL}/story/contact/${data}`,
      config
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const uploadStoryToService = async (data) => {
  try {
    const res = await axios.post(
      `${STORY_SERVICE_URL}/story/save`,
      data,
      config
    );
    return res.data;
  } catch (err) {}
};

export const getUploadUrl = async (data) => {
  try {
    const res = await axios.post(`${STORY_SERVICE_URL}/story`, data, config);
    return res.data;
  } catch (err) {
    toast.error(`Upload unsuccessful: ${err.message}`);
    return null;
  }
};

export const uploadStory = async (url, type, file) => {
  try {
    const res = await axios.put(url, file, {
      headers: {
        ...config.headers,
        "Content-Type": type,
        "Process-Data": false,
      },
    });
    return res;
  } catch (err) {
    toast.error(`Upload unsuccessful: ${err.message}`);
    return null;
  }
};

export const getUserChats = async (userId) => {
  try{
    const res = await axios.get(`${CHAT_SERVICE_URL}/chats?userId=${userId}`, config);
    return res.data;
  }catch(err){
    toast.error(`Getting chats unsuccessful: ${err.message}`);
    return null;
  }
}

export const createChat = async (data) => {
  try{
    const res = await axios.post(`${CHAT_SERVICE_URL}/chats`, data, config);
    return res.data;
  }catch(err){
    toast.error(`Creating chat unsuccessful: ${err.message}`);
    return null;
  }
}

export const getLastNMessages = async (chatId,userId, number) => {
  try{
    console.log(`${MESSAGES_SERVICE_URL}?chatId=${chatId}&userId=${userId}&number=${number}`);  
    const res = await axios.get(`${MESSAGES_SERVICE_URL}?chatId=${chatId}&userId=${userId}&number=${number}`, config);
    return res.data;
  }catch(err){
    toast.error(`Getting messages unsuccessful: ${err.message}`);
    return null;
  }
}

export const sendMessage = async (data) => {
  try{
    const res = await axios.post(`${CHAT_SERVICE_URL}/messages`, data, config);
    return res.data;
  }catch(err){
    toast.error(`Sending message unsuccessful: ${err.message}`);
    return null;
  }
}

// export const uploadAttachement = async (data) => {
//   try{
//     const res = await axios.post(`${MEDIA_SERVICE_URL}/generate-upload-url`, data.upload, config).then((res) => {
      
//     });
//   }catch(err){
//     toast.error(`Uploading attachment unsuccessful: ${err.message}`);
//     return null;
//   }
// }