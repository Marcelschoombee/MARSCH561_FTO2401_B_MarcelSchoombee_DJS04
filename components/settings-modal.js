const template = document.createElement('template');

template.innerHTML = /* html */ `


<dialog class="overlay" data-settings-overlay>
    <div class="overlay__content">
      <form class="overlay__form" data-settings-form id="settings">
        <label class="overlay__field">
          <div class="overlay__label">Theme</div>

          <select class="overlay__input overlay__input_select" data-settings-theme name="theme">
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>
        </label>
      </form>

      <div class="overlay__row">
        <button class="overlay__button" data-settings-cancel>Cancel</button>
        <button class="overlay__button overlay__button_primary" type="submit" form="settings">Save</button>
      </div>
    </div>
  </dialog>
`;

class SettingsModal extends HTMLElement {
  #inner = this.attachShadow({ mode: "closed" });
  connectedCallback() {
    const node = template.content.cloneNode(true);
    this.#inner.appendChild(node);
  }
}

customElements.define('settings-modal', SettingsModal);