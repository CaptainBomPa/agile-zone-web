import axios from "axios";

export default function UserInfo() {}

export async function getUserInfo() {
  try {
    const response = await axios.get(
      `http://10.0.1.64:8080/api/user/myInfo`
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
  try {
    const response = await axios.get(
      `http://10.0.1.64:8080/api/user/avatar`
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
    const response = await axios.put(
      `http://10.0.1.64:8080/api/user`,
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
  try {
    const response = await axios.put(
      "http://10.0.1.64:8080/api/user/password",
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
    const response = await axios.put(
      "http://10.0.1.64:8080/api/user/full",
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
    const response = await axios.get(
      "http://10.0.1.64:8080/api/user/blocked"
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
    const response = await axios.put(
      "http://10.0.1.64:8080/api/user/unlock",
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
    const response = await axios.put(
      "http://10.0.1.64:8080/api/user/block",
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

