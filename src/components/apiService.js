const API_KEY = '22353623-6201980fc547853fa44be7702';
const BASE_URL = 'https://pixabay.com/api';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchImages() {

        const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

        return fetch(url)
            .then(response => response.json())
            .then(({ hits }) => {
                this.incrementPage();
                return hits;
            });
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}