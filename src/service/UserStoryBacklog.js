import axios from "axios";

export default function UserStoryBacklog() {}

export async function getBacklogForCurrentUser() {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const response = await axios.get(
      apiUrl + "/api/iteration/backlog/current"
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

export async function getBacklogForTeam(teamId) {
  try {
    const response = await axios.get(
      apiUrl + `/api/iteration/backlog/teamId/${teamId}`
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

export async function getBacklogProject() {
  try {
    const response = await axios.get(
      apiUrl + `/api/iteration/backlog/project`
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
