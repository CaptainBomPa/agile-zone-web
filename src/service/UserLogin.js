import axios from "axios";

export default function UserLogin() {
}

export async function loginUser(credentials, setLoading) {
  setLoading(true);
  
  try {
    const response = await axios.post(
      "http://10.0.1.64:8080/api/auth/authenticate", credentials
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
