import axios from "axios";

export default function Features() {}

export async function getAllWithStories() {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.get(
      apiUrl + "/api/feature/stories"
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

export async function addNewFeature(feature) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.put(
      apiUrl + "/api/feature",
        feature
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
