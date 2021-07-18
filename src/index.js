import ImagesApiService from "./components/apiService";
import imagesTemplate from "./templates/images.hbs";
import * as basicLightbox from 'basiclightbox';
import toastr from "toastr";
import 'toastr/build/toastr.css';
const debounce = require("lodash.debounce");

const refs = {
    searchForm: document.querySelector('#search-form'),
    imagesList: document.querySelector('.gallery'),
    anchor: document.querySelector('#anchor'),
    spinner: document.querySelector('#spinner'),
    goUpBtn: document.getElementById('back-to-top')
}

const imagesApiService = new ImagesApiService();
const observer = new IntersectionObserver(loadMore, {
    threshold: 0,
});
const formObserver = new IntersectionObserver(onTopScroll, {
    threshold: 0,
});

formObserver.observe(refs.searchForm);



refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();

    imagesApiService.query = e.currentTarget.elements.query.value;
    if (imagesApiService.query === '') {
        return toastr.error("Enter query to search");
    }

    refs.spinner.classList.remove('visually-hidden');
    imagesApiService.resetPage();
    imagesApiService.fetchImages().then(images => {
        clearGallery();
        apppendMarkup(images);
        refs.spinner.classList.add('visually-hidden');
        observer.observe(refs.anchor);
    });
}

function apppendMarkup(images) {
    refs.imagesList.insertAdjacentHTML('beforeend', imagesTemplate(images));
}

function clearGallery() {
    refs.imagesList.innerHTML = '';
}

function loadMore([entrie]) {
    if (!entrie.isIntersecting) return;
    refs.spinner.classList.remove('visually-hidden');
    imagesApiService.fetchImages().then(images => {
        refs.spinner.classList.add('visually-hidden');
        apppendMarkup(images);
        if (images.length === 0) {
          debounce(toastr.warning('End of content'), 500);
        }
    });
    refs.goUpBtn.classList.remove('visually-hidden');

    
}


refs.imagesList.onclick = (evt) => {
    // evt.preventDefault();

    if (evt.target.nodeName !== 'IMG') return;

    console.log(evt.target.nodeName);

    basicLightbox.create(`
        <img src=${evt.target.dataset.source} alt='' width='1200'>
    `).show(evt);
}

function onTopScroll([entrie]) {
    if (entrie.isIntersecting) {
        refs.goUpBtn.classList.add('visually-hidden');
    } else if (!entrie.isIntersecting) {
        refs.goUpBtn.classList.remove('visually-hidden');
    }
    
}