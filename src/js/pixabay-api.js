export const BASE_LINK = "https://pixabay.com/api/";
const API_KEY = "42886429-7a7bfb8153d3dee4354b6c91e";

export const options = {
    params: {
        key: API_KEY,
        q: "",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: 1,
        per_page: 40,
    }
};