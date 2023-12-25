import axios from "axios";

export default function Tags() {}

export async function getAllTagsWithStats() {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.get(
      apiUrl + "/api/tags/stats"
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

export async function addNewTag(tagName) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const response = await axios.post(apiUrl + "/api/tags", {
      tagName,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeTag(tagId) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    try {
      const response = await axios.delete(apiUrl + `api/tags/${tagId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
