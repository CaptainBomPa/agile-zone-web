import axios from "axios";

export default function UserStoryUser() {}

export async function getUserStoriesIteration() {
  try {
    const response = await axios.get(
      "http://10.0.1.64:8080/api/iteration/current"
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserStoriesIterationTeam(teamId, iterationId) {
  try {
    const response = await axios.get(
      `http://10.0.1.64:8080/api/iteration/team/${teamId}/iteration/${iterationId}`
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
    const response = await axios.delete(
      `http://10.0.1.64:8080/api/userStory/${id}`
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
    const response = await axios.put(
      "http://10.0.1.64:8080/api/userStory/multiple",
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
    const response = await axios.delete(
      `http://10.0.1.64:8080/api/task/${id}`
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
    const response = await axios.post(
      "http://10.0.1.64:8080/api/task",
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
    const response = await axios.put(
      "http://10.0.1.64:8080/api/task",
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
