// @ts-check

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Books Preview class
class BookPreview {
    constructor(books, authors, genres, BOOKS_PER_PAGE) {
        this.books = books;
        this.authors = authors;
        this.genres = genres;
        this.booksPerPage = BOOKS_PER_PAGE;
        this.page = 1;
        this.matches = books;
    }

    createBookPreview({ author, id, image, title }) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${this.authors[author]}</div>
            </div>
        `;

        return element;
    }

    renderBookPreviews(books, container) {
        const fragment = document.createDocumentFragment();
        books.forEach(book => {
            const bookPreview = this.createBookPreview(book);
            fragment.appendChild(bookPreview);
        });

        container.appendChild(fragment);
    }

    initializeBookPreviews() {
        const container = document.querySelector('[data-list-items]');
        const initialBooks = this.books.slice(0, this.booksPerPage);
        this.renderBookPreviews(initialBooks, container);
    }
}

// Class for the genre options
class GenreDropdown {
    constructor(genres) {
        this.genres = genres;
    }

    createGenreOptions() {
        const fragment = document.createDocumentFragment();
        const firstGenreElement = document.createElement('option');
        firstGenreElement.value = 'any';
        firstGenreElement.innerText = 'All Genres';
        fragment.appendChild(firstGenreElement);

        Object.entries(this.genres).forEach(([id, name]) => {
            const element = document.createElement('option');
            element.value = id;
            element.innerText = name;
            fragment.appendChild(element);
        });

        return fragment;
    }

    initializeGenreDropdown() {
        const genreHtml = this.createGenreOptions();
        document.querySelector('[data-search-genre]').appendChild(genreHtml);
    }
}

// Class for Author dropdown
class AuthorDropdown {
    constructor(authors) {
        this.authors = authors;
    }

    createAuthorOptions() {
        const fragment = document.createDocumentFragment();
        const firstAuthorElement = document.createElement('option');
        firstAuthorElement.value = 'any';
        firstAuthorElement.innerText = 'All Authors';
        fragment.appendChild(firstAuthorElement);

        Object.entries(this.authors).forEach(([id, name]) => {
            const element = document.createElement('option');
            element.value = id;
            element.innerText = name;
            fragment.appendChild(element);
        });

        return fragment;
    }

    initializeAuthorDropdown() {
        const authorsHtml = this.createAuthorOptions();
        document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    }
}

// Theme settings class
class ThemeSettings {
    initializeThemeSettings() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelector('[data-settings-theme]').value = 'night';
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.querySelector('[data-settings-theme]').value = 'day';
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
    }
}

// Event handler class
class EventHandlers {
    constructor(bookPreview) {
        this.bookPreview = bookPreview;
    }

    initializeEventHandlers() {
        this.addEventListeners([
            { selector: '[data-search-cancel]', event: 'click', handler: () => this.closeOverlay('[data-search-overlay]') },
            { selector: '[data-settings-cancel]', event: 'click', handler: () => this.closeOverlay('[data-settings-overlay]') },
            { selector: '[data-header-search]', event: 'click', handler: () => this.openOverlay('[data-search-overlay]', '[data-search-title]') },
            { selector: '[data-header-settings]', event: 'click', handler: () => this.openOverlay('[data-settings-overlay]') },
            { selector: '[data-list-close]', event: 'click', handler: () => this.closeOverlay('[data-list-active]') }
        ]);

        document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
        document.querySelector('[data-list-button]').disabled = (this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) <= 0;

        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${(this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) > 0 ? (this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) : 0})</span>
        `;

        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);

            if (theme === 'night') {
                document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
                document.documentElement.style.setProperty('--color-light', '10, 10, 20');
            } else {
                document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
                document.documentElement.style.setProperty('--color-light', '255, 255, 255');
            }

            document.querySelector('[data-settings-overlay]').open = false;
        });

        document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const filters = Object.fromEntries(formData);
            const result = [];

            for (const book of books) {
                let genreMatch = filters.genre === 'any';

                for (const singleGenre of book.genres) {
                    if (genreMatch) break;
                    if (singleGenre === filters.genre) { genreMatch = true; }
                }

                if (
                    (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                    (filters.author === 'any' || book.author === filters.author) &&
                    genreMatch
                ) {
                    result.push(book);
                }
            }

            this.bookPreview.page = 1;
            this.bookPreview.matches = result;

            if (result.length < 1) {
                document.querySelector('[data-list-message]').classList.add('list__message_show');
            } else {
                document.querySelector('[data-list-message]').classList.remove('list__message_show');
            }

            document.querySelector('[data-list-items]').innerHTML = '';
            const newItems = document.createDocumentFragment();

            for (const book of result.slice(0, BOOKS_PER_PAGE)) {
                const element = this.bookPreview.createBookPreview(book);
                newItems.appendChild(element);
            }

            document.querySelector('[data-list-items]').appendChild(newItems);
            document.querySelector('[data-list-button]').disabled = (this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) < 1;

            document.querySelector('[data-list-button]').innerHTML = `
                <span>Show more</span>
                <span class="list__remaining"> (${(this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) > 0 ? (this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) : 0})</span>
            `;

            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.querySelector('[data-search-overlay]').open = false;
        });

        document.querySelector('[data-list-button]').addEventListener('click', () => {
            const fragment = document.createDocumentFragment();

            for (const book of this.bookPreview.matches.slice(this.bookPreview.page * BOOKS_PER_PAGE, (this.bookPreview.page + 1) * BOOKS_PER_PAGE)) {
                const element = this.bookPreview.createBookPreview(book);
                fragment.appendChild(element);
            }

            document.querySelector('[data-list-items]').appendChild(fragment);
            this.bookPreview.page += 1;
        });

        document.querySelector('[data-list-items]').addEventListener('click', (event) => {
            const pathArray = Array.from(event.composedPath());
            let active = null;

            for (const node of pathArray) {
                if (active) break;

                if (node?.dataset?.preview) {
                    active = this.bookPreview.matches.find(book => book.id === node.dataset.preview);
                }
            }

            if (active) {
                document.querySelector('[data-list-active]').open = true;
                document.querySelector('[data-list-blur]').src = active.image;
                document.querySelector('[data-list-image]').src = active.image;
                document.querySelector('[data-list-title]').innerText = active.title;
                document.querySelector('[data-list-subtitle]').innerText = `${this.bookPreview.authors[active.author]} (${new Date(active.published).getFullYear()})`;
                document.querySelector('[data-list-description]').innerText = active.description;
            }
        });
    }

    addEventListeners(events) {
        events.forEach(({ selector, event, handler }) => {
            document.querySelector(selector).addEventListener(event, handler);
        });
    }

    closeOverlay(selector) {
        document.querySelector(selector).open = false;
    }

    openOverlay(selector, focusSelector = null) {
        document.querySelector(selector).open = true;
        if (focusSelector) {
            document.querySelector(focusSelector).focus();
        }
    }
}

// Initialization
const bookPreview = new BookPreview(books, authors, genres, BOOKS_PER_PAGE);
bookPreview.initializeBookPreviews();

const genreDropdown = new GenreDropdown(genres);
genreDropdown.initializeGenreDropdown();

const authorDropdown = new AuthorDropdown(authors);
authorDropdown.initializeAuthorDropdown();

const themeSettings = new ThemeSettings();
themeSettings.initializeThemeSettings();

const eventHandlers = new EventHandlers(bookPreview);
eventHandlers.initializeEventHandlers();