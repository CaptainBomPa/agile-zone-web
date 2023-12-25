import axios from "axios";

export default function UserInfo() {}

export async function getUserInfo() {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.get(
      apiUrl + `/api/user/myInfo`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getUserAvatar() {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.get(
      apiUrl + `/api/user/avatar`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserInfo(userDetails) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.put(
      apiUrl + `/api/user`,
      userDetails
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updatePassword(oldPassword, newPassword) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.put(
      apiUrl + "/api/user/password",
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
    );
    if (response.status === 200) {
      return response.status;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateFullUser(user) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.put(
      apiUrl + "/api/user/full",
      user
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAllBlocked() {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.get(
      apiUrl + "/api/user/blocked"
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function unlockUsers(users) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.put(
      apiUrl + "/api/user/unlock",
      users
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeUsers(users) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.put(
      apiUrl + "/api/user/block",
      users
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

