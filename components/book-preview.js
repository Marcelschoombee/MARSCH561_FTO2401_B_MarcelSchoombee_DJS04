


const template = document.createElement

template.innerHTML = /* html */ `



<main class="list"><slot>
    <div class="list__items" data-list-items></div>
    <div class="list__message" data-list-message>No results found. Your filters might be too narrow.</div>
    <button class="list__button" data-list-button></button>
  </main>


<dialog class="overlay" data-list-active><slot>
    <div class="overlay__preview"><img class="overlay__blur" data-list-blur src="" /><img class="overlay__image"
        data-list-image src="" /></div>
    <div class="overlay__content">
      <h3 class="overlay__title" data-list-title></h3>
      <div class="overlay__data" data-list-subtitle></div>
      <p class="overlay__data overlay__data_secondary" data-list-description></p>
    </div>

    <div class="overlay__row">
      <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
    </div></slot>
  </dialog>

`;

class BookPreview
    extends HTMLElement {
    #inner = this.attachShadow({ mode: "closed" })
    connectedCallback() {
        const node = template.content.cloneNode(true);
        this.#inner.appendChild(node)

    }
}

customElements.define('book-preview', BookPreview);
