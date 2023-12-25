import axios from "axios";

export default function UserStoryEdit() {}

export async function getAllFeatures() {
  try {
    const response = await axios.get("http://10.0.1.64:8080/api/feature");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAllTags() {
  try {
    const response = await axios.get("http://10.0.1.64:8080/api/tags");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAllUsers() {
  try {
    const response = await axios.get(
      "http://10.0.1.64:8080/api/user/avatars"
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

export async function getAllProjects() {
  try {
    const response = await axios.get("http://10.0.1.64:8080/api/project");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAllTeams() {
  try {
    const response = await axios.get("http://10.0.1.64:8080/api/team");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAllIterations() {
  try {
    const response = await axios.get("http://10.0.1.64:8080/api/iteration");
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateStory(story) {
  try {
    const response = await axios.put(
      "http://10.0.1.64:8080/api/userStory",
      story
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

export async function addUserStory(userStory) {
  try {
    const response = await axios.post(
      "http://10.0.1.64:8080/api/userStory",
      userStory
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
