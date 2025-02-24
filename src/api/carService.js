import axios from "axios";
 
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with actual API
 
export const getCars = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching car data", error);
    return [];
  }
};