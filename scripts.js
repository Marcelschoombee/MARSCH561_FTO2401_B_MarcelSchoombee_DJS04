// @ts-check

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Books Preview class
// Abstracts the functionality to create a book preview class
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
        const element = document.createElement('button')
        element.classList = 'preview';
        element.setAttribute('data-preview', id)
        element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

        return element;
    }

    /**
     * Render a list of books
     * The list of the books in the array
     * The preview container of the book
     */

    renderBookPreviews(books, container) {
        const fragment = document.createDocumentFragment();
        books.forEach(book => {
            const bookPreview = this.createBookPreview(book);
            fragment.appendChild(bookPreview);
        });

        container.appendChild(fragment);
    }

    /**
     * Initialize preview
     */
    initializeBookPreviews() {
        const container = document.querySelector('[data-list-items}');
        const initialBooks = this.books.slice(0, this.booksPerPage);
        this.renderBookPreviews(initialBooks, container);

    };
};

/**
 * Class for the genre options
 */
class genreDropdown {
    constructor(genres) {
        this.genres = genres;

    }


    createGenreOptions() {
        const fragment = document.createDocumentFragment()
        const firstGenreElement = document.createElement('option')
        firstGenreElement.value = 'any'
        firstGenreElement.innerText = 'All Genres'
        genreHtml.appendChild(firstGenreElement)


        Object.entries(genres).forEach(([id, name]) => {
            const element = document.createElement('option')
            element.value = id
            element.innerText = name
            genreHtml.appendChild(element)
        });

        return fragment;
    }

    initializeGenreDropdown() {
        const genreHtml = this.createGenreOptions();
        document.querySelector('[data-search-genre]').appendChild(genreHtml)
    }
}

/**
 * Class for Author dropdown
 */
class AuthorDropdown {
    constructor(authors) {
        this.autors = authors;
    }

    createAuthorOptions() {

        const fragment = document.createDocumentFragment();
        const firstAuthorElement = document.createElement('option');
        firstAuthorElement.value = 'any';
        firstAuthorElement.innerText = 'All Authors';
        authorsHtml.appendChild(firstAuthorElement);
        /**
         * Object function for author options
         */
        Object.entries(authors).forEach(([id, name]) => {
            const element = document.createElement('option')
            element.value = id
            element.innerText = name
            authorsHtml.appendChild(element)
        });

        return fragment;
    }
    initializeAuthorDropdown() {
        const authorsHtml = this.createAthorOptions();
        document.querySelector('[data-search-authors]').appendChild(authorsHtml)
    }
}

// Theme settings class
class ThemeSettings {

    /**
     * Function to switch themes
     */
    initializeThemeSettings() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelector('[data-settings-theme]').value = 'night'
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.querySelector('[data-settings-theme]').value = 'day'
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
    }

}


class EventHandler() {
    constructor(bookPreview) {
        this.bookPreview = bookPreview;
    }

    document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
    document.querySelector('[data-list-button]').disabled = (this.bookPreview.matches.length -
        (this.bookPreview.page * BOOKS_PER_PAGE)) > 0

    document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(this.bookPreview.matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false
    })

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false
    })

    document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true
        document.querySelector('[data-search-title]').focus()
    })

    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true
    })

    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false
    })

    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const { theme } = Object.fromEntries(formData)

        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }

        document.querySelector('[data-settings-overlay]').open = false
    })

    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const filters = Object.fromEntries(formData)
        const result = []

        for (const book of books) {
            let genreMatch = filters.genre === 'any'

            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true }
            }

            if (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (filters.author === 'any' || book.author === filters.author) &&
                genreMatch
            ) {
                result.push(book)
            }
        }

        page = 1;
        matches = result

        if (result.length < 1) {
            document.querySelector('[data-list-message]').classList.add('list__message_show')
        } else {
            document.querySelector('[data-list-message]').classList.remove('list__message_show')
        }

        document.querySelector('[data-list-items]').innerHTML = ''
        const newItems = document.createDocumentFragment()

        for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)

            element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

            newItems.appendChild(element)
        }

        document.querySelector('[data-list-items]').appendChild(newItems)
        document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

        document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('[data-search-overlay]').open = false
    })

    document.querySelector('[data-list-button]').addEventListener('click', () => {
        const fragment = document.createDocumentFragment()

        for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)

            element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

            fragment.appendChild(element)
        }

        document.querySelector('[data-list-items]').appendChild(fragment)
        page += 1
    })

    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath())
        let active = null

        for (const node of pathArray) {
            if (active) break

            if (node?.dataset?.preview) {
                let result = null

                for (const singleBook of books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook
                }

                active = result
            }
        }

        if (active) {
            document.querySelector('[data-list-active]').open = true
            document.querySelector('[data-list-blur]').src = active.image
            document.querySelector('[data-list-image]').src = active.image
            document.querySelector('[data-list-title]').innerText = active.title
            document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
            document.querySelector('[data-list-description]').innerText = active.description
        }
    })

    function initializeBookPreviews() {
        throw new Error('Function not implemented.');
    }
    function returns(target: undefined, context: ClassFieldDecoratorContext<genreDropdown, () => any> & { name: ''; private: false; static: false; }): void | ((this: genreDropdown, value: () => any) => () => any) {
        throw new Error('Function not implemented.');
    }

    function createGenreOptions() {
        throw new Error('Function not implemented.');
    }

