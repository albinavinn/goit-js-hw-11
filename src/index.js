import Notiflix from 'notiflix';
import { ApiPixabay } from './js/apiPixabay';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const apiPixabay = new ApiPixabay();

loadMoreBtnHidden();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  const searchValue = event.target.elements.searchQuery.value.trim();

  if (!searchValue) {
    Notiflix.Notify.info('Please input your request!');
    return;
  }

  apiPixabay.resetPage();
  apiPixabay.setSearchValue(searchValue);

  try {
    const {
      data: { hits, totalHits },
    } = await apiPixabay.getImages();

    if (!hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.gallery.innerHTML = '';
      return loadMoreBtnHidden();
    }

    apiPixabay.setTotalHits(totalHits);

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    const normalizedHits = getNormalizedImages(hits);
    const imagesMarkup = getImagesMarkup(normalizedHits);
    console.log(hits);

    refs.gallery.innerHTML = imagesMarkup;

    apiPixabay.checkLastPage() ? loadMoreBtnHidden() : loadMoreBtnShow();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  apiPixabay.incrementPage();
  try {
    const {
      data: { hits },
    } = await apiPixabay.getImages();
    const markup = getImagesMarkup(getNormalizedImages(hits));
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    apiPixabay.checkLastPage() ? loadMoreBtnHidden() : loadMoreBtnShow();
  } catch (error) {
    console.log(error.message);
  }
}

function loadMoreBtnHidden() {
  refs.loadMoreBtn.style.display = 'none';
}
function loadMoreBtnShow() {
  refs.loadMoreBtn.style.display = 'block';
}

function getNormalizedImages(array) {
  return array.map(({ webformatURL, likes, views, comments, downloads }) => ({
    webformatURL,
    likes,
    views,
    comments,
    downloads,
  }));
}

function getImagesMarkup(array) {
  return array
    .map(
      ({
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
              <img src="${webformatURL}" alt="" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes ${likes}</b>
                </p>
                <p class="info-item">
                  <b>Views ${views}</b>
                </p>
                <p class="info-item">
                  <b>Comments ${comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads ${downloads}</b>
                </p>
              </div>
            </div>`
    )
    .join('');
}