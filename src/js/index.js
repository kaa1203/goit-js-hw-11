import { BASE_LINK, options } from "./pixabay-api.js";
import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const form = document.querySelector("#search-form");
const searchBar = document.querySelector("input[name='searchQuery']");
const deleteText = document.querySelector(".delete");
const gallery = document.querySelector(".gallery");

form.addEventListener("submit", onSubmit);
searchBar.addEventListener("input", onInput);
deleteText.addEventListener("click", deleteInput);
document.addEventListener("scroll", onScroll);

let totalHit = 0;

const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});


async function onSubmit(e) {
    e.preventDefault();
    const input = options.params.q = searchBar.value;
    gallery.innerHTML = "";

    try {
        const res = await axios.get(BASE_LINK, options);
        const { totalHits, hits } = res.data;

        totalHit = totalHits;

        if (input === "") { return Notify.failure("Fill the search bar first!") }

        if (hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            Notify.success(`Hooray! We found ${totalHit} images.`);
            createCards(hits);
        }
    } catch (err) {
        Notify.failure(err);
    }
}

async function loadMore() {
    if (options.params.page * options.params.per_page < totalHit) {
        options.params.page += 1;

        try {
            const res = await axios.get(BASE_LINK, options);
            createCards(res.data.hits);
        } catch (err) {
            Notify.failure(err);
        }

    } else {
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

function createCards(hits) {
    hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        let cards = `
            <a href="${largeImageURL}" class="lightbox">
                <div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${downloads}
                        </p>
                    </div>
                </div>
            </a>
        `;
        gallery.insertAdjacentHTML("beforeend", cards);
    })
        .join("");
}

function onInput(e) {
    let text = e.target.value;

    if (text !== "") {
        deleteText.classList.remove("is-hidden");    
    } else {
        deleteText.classList.add("is-hidden");    
    }
}

function deleteInput() {
    searchBar.value = "";
    deleteText.classList.add("is-hidden");
    searchBar.focus();
}

function onScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
        loadMore();
    }
}