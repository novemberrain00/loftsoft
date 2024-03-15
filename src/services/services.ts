import Categories from "../adminPanel/sections/categories/categories";
import { CategoryI, LoginResponseI, ShortUserI } from "../interfaces";

const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

const getData = async (url: string, isAuthRequired = false) => {
  const headers = isAuthRequired ? {
    "Authorization": 'Bearer ' + getCookie('access_token') as string,
    "Content-Type": "application/json"
  } : {
    "Content-Type": "application/json"
  }

  return await fetch(baseURL + url, {
      method: 'GET',
      headers: headers as HeadersInit 
  })
  .then(response => response.json())
  .catch(error => console.error('Fetch error:', error));
}

const postData = async (url: string, data: object, isAuthRequired = false) => {
  const headers = isAuthRequired ? {
    "Authorization": 'Bearer ' + getCookie('access_token') as string,
    "Content-Type": "application/json"
  } : {
    "Content-Type": "application/json"
  }

  return await fetch(`${baseURL}${url}`, {
      body: JSON.stringify(data),
      headers: headers as HeadersInit,
      method: "POST"
  })
  .then(response =>  response.json())
  .catch(error => console.error('Fetch error:', error))
}

const deleteData = async (url: string) => {
  return await fetch(`${baseURL}${url}`, {
    headers: {
      Accept: "application/json",
      Authorization: 'Bearer ' + getCookie('access_token') as string,
    },
    method: "DELETE"
  }).then(response => {
    return response.json();
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

const uploadFile = async (img: Blob) => {
  const body = new FormData;
  body.append("file", img);

  return await fetch(`${baseURL}/upload`, {
    body,
    method: "POST"
  })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

const updateCurrentUser = async (payload: ShortUserI) => {
  return await fetch(`${baseURL}/user/me`, {
    body: JSON.stringify(payload),
    headers: {
      "Accept": "application/json",
      "Authorization": 'Bearer ' + getCookie('access_token') as string,
      "Content-Type": "application/json"
    },
    method: "PATCH"
  })
  .then(response => {
    return response.json();
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

const getCookie = (name: string) => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const convertToLatin = (str: string): string => {
  const dictionary: {[key: string]: string} = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya', ' ': '-'
  };

  return str.toLowerCase()
            .split('')
            .map(char => dictionary[char] || char)
            .join('');
}

const timestampToTime =(timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    
    return `${hours}:${paddedMinutes}`;
}

export { getData, postData, getCookie, uploadFile, updateCurrentUser, convertToLatin, deleteData, timestampToTime };