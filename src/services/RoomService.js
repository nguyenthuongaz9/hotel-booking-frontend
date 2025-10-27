import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const roomService = {
  createRoom: async (roomData, imageFiles) => {
    try {
      const formData = new FormData();

      formData.append("room", JSON.stringify(roomData));

      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          if (file) {
            formData.append("images", file);
          }
        });
      }

      console.log("API Base URL:", API_BASE_URL);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${API_BASE_URL}/rooms`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.error("Create a room error", error);
      throw error;
    }
  },
  getRooms: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 8,
        search = "",
        sortBy = "roomNumber",
        sortOrder = "asc",
        type = null,
        minPrice = null,
        maxPrice = null,
        capacity = null,
        isAvailable = null,
      } = params;

      const queryParams = new URLSearchParams();

      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      if (search) queryParams.append("search", search);
      if (type) queryParams.append("type", type);
      if (minPrice) queryParams.append("minPrice", minPrice.toString());
      if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());
      if (capacity) queryParams.append("capacity", capacity.toString());
      if (isAvailable !== null)
        queryParams.append("isAvailable", isAvailable.toString());

      if (sortBy) {
        const sortDirection = sortOrder === "desc" ? "desc" : "asc";
        const backendSortField = mapSortFieldToBackend(sortBy);
        queryParams.append("sort", `${backendSortField},${sortDirection}`);
      }

      const url = `${API_BASE_URL}/rooms?${queryParams.toString()}`;
      console.log("Fetching rooms from:", url);

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },
  getRoomById: async (id) => {
    try {
      const url = `${API_BASE_URL}/rooms/${id}`;
      console.log("Fetching room from:", url);

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching room:", error);
      throw error;
    }
  },
};

function mapSortFieldToBackend(frontendField) {
  const fieldMap = {
    roomNumber: "roomNumber",
    price: "pricePerNight",
    capacity: "capacity",
    createdAt: "createdAt",
    type: "type",
  };
  return fieldMap[frontendField] || frontendField;
}
