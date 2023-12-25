import axios from "axios";

export default function UserLogin() {
}

export async function loginUser(credentials, setLoading) {
  setLoading(true);
  
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.post(
      apiUrl + "/api/auth/authenticate", credentials
    );
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
  setLoading(false);
}
