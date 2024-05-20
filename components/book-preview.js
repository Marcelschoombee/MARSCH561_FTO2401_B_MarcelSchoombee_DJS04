
customElements.define('book-preview', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML =  /* html */ `

<dialog class="overlay" data-list-active>
  <slot>
    <div class="overlay__preview">
      <img class="overlay__blur" data-list-blur src="" />
      <img class="overlay__image" data-list-image src="" />
    </div>
    <div class="overlay__content">
      <h3 class="overlay__title" data-list-title></h3>
      <div class="overlay__data" data-list-subtitle></div>
      <p class="overlay__data overlay__data_secondary" data-list-description></p>
    </div>
    <div class="overlay__row">
      <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
    </div>
  </slot>
</dialog>
`;


  }
});


