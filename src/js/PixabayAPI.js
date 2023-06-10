import axios from "axios";

export default getFoto

const API_KEY = '36162487-3242279a4e4b4636d018bd815';

function getFoto(date, page) {
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${date}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=39`;

    return axios(URL).then(({ data }) => {
        if (data.hits.length > 0) {
            return data
        }
    }).catch(console.log)
}