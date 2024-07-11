import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
});

export const BASEURL = "http://localhost:3000/api";

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

// const fetchData = async () => {
//   try {
//     const response = await axios.get(
//       "http://localhost:3000/api/auth/get-user",
//       {
//         withCredentials: true,
//       }
//     );
//     console.log(response.data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
