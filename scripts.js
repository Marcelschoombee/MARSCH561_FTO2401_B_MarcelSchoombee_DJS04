// @ts-check

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

/**
 * BookPreview Class
 * Functionality to create and render book previews.
 */
class BookPreview {

    /**
     * Creates a preview button element for a book.
     * @param {Object} books - The book data object.
     * @param {string} authors - The list of the authors.
     * @param {string} genres - The list for the genre of books.
     * @returns {HTMLElement} - Returns the preview.
     * @param {number} BOOKS_PER_PAGE - Number of books per page.
     */
    constructor(books, authors, genres, BOOKS_PER_PAGE) {
        this.books = books;
        this.authors = authors;
        this.genres = genres;
        this.booksPerPage = BOOKS_PER_PAGE;
        this.page = 1;
        this.matches = books;
    }
    /**
     * 
     * @param {BookPreview} createBookPreview - Shows a modal of the book preview. 
     * @returns {element} 
     */
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

    /**
     * @param {any[]} books
     * @param {Element | null} container
     */
    renderBookPreviews(books, container) {
        const fragment = document.createDocumentFragment();
        books.forEach((/** @type {{ author: any; id: any; image: any; title: any; }} */ book) => {
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

/**
 *  Class for the genre options
 *  Shows a Dropdown menu of the genres of the books
*/
class GenreDropdown {
    /**
     * @param {object} genres - The genre data object.
     * @param {string} genres - Select book genres from a list
     * @returns {Elements} 
     */
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
        document.querySelector('[data-search-genre]')
        return genreHtml;
    }
}

// Class for Author dropdown
class AuthorDropdown {
    /**
     * @param {object} authors - The authors data of the object.
     * @param {string} authors - A list of Authors
     */
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
    /**
     * 
     * @returns {authors} - Gives a dropdown menu of authors.
     */
    initializeAuthorDropdown() {
        const authorsHtml = this.createAuthorOptions();
        document.querySelectorAll('[data-search-authors]');
        return authorsHtml;
    }
}

// Theme settings class
class ThemeSettings {
    initializeThemeSettings() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelectorAll('[data-settings-theme]').values = 'night';
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.querySelectorAll('[data-settings-theme]').values = 'day';
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
    }
}

/**
 * Make selectors  objects for better refactoring
 */
const SELECTORS = {
    searchCancel: '[data-search-cancel]',
    settingsCancel: '[data-settings-cancel]',
    headerSearch: '[data-header-search]',
    headerSettings: '[data-header-settings]',
    listClose: '[data-list-close]',
    listButton: '[data-list-button]',
    settingsForm: '[data-settings-form]',
    searchForm: '[data-search-form]',
    listItems: '[data-list-items]',
    listMessage: '[data-list-message]',
    searchOverlay: '[data-search-overlay]',
    settingsOverlay: '[data-settings-overlay]',
    listActive: '[data-list-active]',
    listBlur: '[data-list-blur]',
    listImage: '[data-list-image]',
    listTitle: '[data-list-title]',
    listSubtitle: '[data-list-subtitle]',
    listDescription: '[data-list-description]',
    searchTitle: '[data-search-title]',
};
// Event handler class
class EventHandlers {
    /**
     * @param {BookPreview} bookPreview - Preview of selected book
     */
    constructor(bookPreview) {
        this.bookPreview = bookPreview;
        this.initializeForms = undefined;
    }
    // refaktored the event listeners 
    initializeEventHandlers() {
        this.addEventListeners([
            { selector: '[data-search-cancel]', event: 'click', handler: () => this.closeOverlay('[data-search-overlay]') },
            { selector: '[data-settings-cancel]', event: 'click', handler: () => this.closeOverlay('[data-settings-overlay]') },
            { selector: '[data-header-search]', event: 'click', handler: () => this.openOverlay('[data-search-overlay]', '[data-search-title]') },
            { selector: '[data-header-settings]', event: 'click', handler: () => this.openOverlay('[data-settings-overlay]') },
            { selector: '[data-list-close]', event: 'click', handler: () => this.closeOverlay('[data-list-active]') }
        ]);
        /**
         * 
         */
        this.updateListButton();
        this.initializeSettingsForm();
        this.initializeListButton();
        this.initializeListItems();
    }

    /**
 * @param {{ selector: any; event: any; handler: any; }[]} events
 */
    addEventListeners(events) {
        events.forEach(({ selector, event, handler }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener(event, handler);
            } else {
                console.error(`Element not found for selector: ${selector}`);
            }
        });
    }

    /**
 * @param {string} selector
 */
    closeOverlay(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.open = false;
        } else {
            console.error(`Element not found for selector: ${selector}`);
        }
    }

    /**
 * @param {string} selector
 */
    openOverlay(selector, focusSelector = null) {
        const element = document.querySelector(selector);
        if (element) {
            element.open = true;
            if (focusSelector) {
                const focusElement = document.querySelector(focusSelector);
                if (focusElement) {
                    focusElement.focus();
                } else {
                    console.error(`Element not found for focusSelector: ${focusSelector}`);
                }
            }
        } else {
            console.error(`Element not found for selector: ${selector}`);
        }
    }


    updateListButton() {
        const listButton = document.querySelector(SELECTORS.listButton);
        if (listButton) {
            listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
            listButton.disabled = (this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE)) <= 0;
            listButton.innerHTML = `
                    <span>Show more</span>
                    <span class="list__remaining"> (${Math.max(this.bookPreview.matches.length - (this.bookPreview.page * BOOKS_PER_PAGE), 0)})</span>
                `;
        }
    }
    /**
     * Switch between dark and day mode
     */

    initializeSettingsForm() {
        const settingsForm = document.querySelector(SELECTORS.settingsForm);
        if (settingsForm) {
            settingsForm.addEventListener('submit', (event) => {
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

                document.querySelector(SELECTORS.settingsOverlay).open = false;
            });
        } else {
            console.error(`Element not found for selector: ${SELECTORS.settingsForm}`);
        }
    }
    /**
     * Search for books
     */
    initializeSearchForm() {
        const searchForm = document.querySelector(SELECTORS.searchForm);
        if (searchForm) {
            searchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(event.target);
                const filters = Object.fromEntries(formData);
                const result = this.filterBooks(filters);

                this.bookPreview.page = 1;
                this.bookPreview.matches = result;

                const listMessage = document.querySelector(SELECTORS.listMessage);
                if (listMessage) {
                    if (result.length < 1) {
                        listMessage.classList.add('list__message_show');
                    } else {
                        listMessage.classList.remove('list__message_show');
                    }
                }

                const listItems = document.querySelector(SELECTORS.listItems);
                if (listItems) {
                    listItems.innerHTML = '';
                    const newItems = document.createDocumentFragment();

                    for (const book of result.slice(0, BOOKS_PER_PAGE)) {
                        const element = this.bookPreview.createBookPreview(book);
                        newItems.appendChild(element);
                    }

                    listItems.appendChild(newItems);
                }

                this.updateListButton();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.querySelector(SELECTORS.searchOverlay).open = false;
            });
        } else {
            console.error(`Element not found for selector: ${SELECTORS.searchForm}`);
        }
    }

    filterBooks(filters) {
        return books.filter((book) => {
            const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
            const authorMatch = filters.author === 'any' || book.author === filters.author;
            const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

            return titleMatch && authorMatch && genreMatch;
        });
    }

    initializeListButton() {
        const listButton = document.querySelector(SELECTORS.listButton);
        if (listButton) {
            listButton.addEventListener('click', () => {
                const fragment = document.createDocumentFragment();

                for (const book of this.bookPreview.matches.slice(this.bookPreview.page * BOOKS_PER_PAGE, (this.bookPreview.page + 1) * BOOKS_PER_PAGE)) {
                    const element = this.bookPreview.createBookPreview(book);
                    fragment.appendChild(element);
                }

                const listItems = document.querySelector(SELECTORS.listItems);
                if (listItems) {
                    listItems.appendChild(fragment);
                }

                this.bookPreview.page += 1;
                this.updateListButton();
            });
        } else {
            console.error(`Element not found for selector: ${SELECTORS.listButton}`);
        }
    }

    initializeListItems() {
        const listItems = document.querySelector(SELECTORS.listItems);
        if (listItems) {
            listItems.addEventListener('click', (event) => {
                const pathArray = Array.from(event.composedPath());
                let active = null;

                for (const node of pathArray) {
                    if (active) break;

                    if (node?.dataset?.preview) {
                        active = this.bookPreview.matches.find((book) => book.id === node.dataset.preview);
                    }
                }

                if (active) {
                    this.showBookDetails(active);
                }
            });
        } else {
            console.error(`Element not found for selector: ${SELECTORS.listItems}`);
        }
    }

    showBookDetails(book) {
        const listActive = document.querySelector(SELECTORS.listActive);
        if (listActive) listActive.open = true;

        const listBlur = document.querySelector(SELECTORS.listBlur);
        if (listBlur) listBlur.src = book.image;

        const listImage = document.querySelector(SELECTORS.listImage);
        if (listImage) listImage.src = book.image;

        const listTitle = document.querySelector(SELECTORS.listTitle);
        if (listTitle) listTitle.innerText = book.title;

        const listSubtitle = document.querySelector(SELECTORS.listSubtitle);
        if (listSubtitle) listSubtitle.innerText = `${this.bookPreview.authors[book.author]} (${new Date(book.published).getFullYear()})`;

        const listDescription = document.querySelector(SELECTORS.listDescription);
        if (listDescription) listDescription.innerText = book.description;
    }
}


/**
* @type {any}
*/
document.addEventListener('DOMContentLoaded', () => {
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
});