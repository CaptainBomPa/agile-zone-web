import axios from "axios";

export default function Tags() {}

export async function getAllTagsWithStats() {
  try {
    const response = await axios.get(
      "http://10.0.1.64:8080/api/tags/stats"
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
  try {
    const response = await axios.post("http://10.0.1.64:8080/api/tags", {
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
    try {
      const response = await axios.delete(`http://10.0.1.64:8080/api/tags/${tagId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Error ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
