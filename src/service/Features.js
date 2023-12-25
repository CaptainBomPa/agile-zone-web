import axios from "axios";

export default function Features() {}

export async function getAllWithStories() {
  try {
    const response = await axios.get(
      "http://10.0.1.64:8080/api/feature/stories"
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
  try {
    const response = await axios.put(
      "http://10.0.1.64:8080/api/feature",
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
