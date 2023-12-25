import axios from "axios";

export default function UserStoryUser() {}

export async function getUserStoriesIteration() {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.get(
      apiUrl + "/api/iteration/current"
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserStoriesIterationTeam(teamId, iterationId) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.get(
      apiUrl + `/api/iteration/team/${teamId}/iteration/${iterationId}`
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

export async function deleteUserStory(id) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.delete(
      apiUrl + `/api/userStory/${id}`
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

export async function deleteMultipleUserStories(ids) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.put(
      apiUrl + "/api/userStory/multiple",
      ids
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

export async function deleteTask(id) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.delete(
      apiUrl + `/api/task/${id}`
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

export async function addTask(taskData) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.post(
      apiUrl + "/api/task",
      taskData
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

export async function updateTask(taskData) {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.put(
      apiUrl + "/api/task",
      taskData
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
