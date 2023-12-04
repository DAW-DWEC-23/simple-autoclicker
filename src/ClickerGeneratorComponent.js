'use strict';

import Helper from "./ClickerHelper.js";
import stylesString from './styles/clicker-generator.scss?inline';

export default class ClickerGenerator extends HTMLElement {

  // Attributes
  static G_ID = 'data-id';
  static G_TITLE = 'data-title';
  static G_PRICE = 'data-price';
  static G_LEVEL = 'data-level';
  static G_MPS = 'data-mps';
  static G_COOLDOWN = 'data-cooldown';
  
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.gId = this.getAttribute(ClickerGenerator.G_ID);
    this.gTitle = this.getAttribute(ClickerGenerator.G_TITLE);
    this.gPrice = parseInt(this.getAttribute(ClickerGenerator.G_PRICE));
    this.gLevel = parseInt(this.getAttribute(ClickerGenerator.G_LEVEL));
    this.gMps = parseInt(this.getAttribute(ClickerGenerator.G_MPS));
    this.gCooldown = parseInt(this.getAttribute(ClickerGenerator.G_COOLDOWN));
    this.bankSavings = 0;
  }
  
  connectedCallback() {
    this.render();
    this.classList.add('hidden');
    if (this.gLevel > 0) this.resetProgressBar();
    document.addEventListener(Helper.MsgBankUpdate, this);
  }

  // Event management

  handleEvent(event) {
    if (event.type === Helper.MsgBankUpdate) {
      this.bankSavings = event.detail.bankSavings;
      this.updateGeneratorVisibility();
      this.updateUpgradeButtonAvailable();
    }
  }

  // Custom event messages

  sendQuantityToBank() {
    const eventMessage = new CustomEvent(Helper.MsgBankAdd, {
      detail: {
        quantity: this.gMps * this.gLevel,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventMessage);
    this.resetProgressBar();
  }

  spendFromTheBank(cost) {
    const eventMessage = new CustomEvent(Helper.MsgBankSubtract, {
      detail: {
        quantity: cost,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventMessage);
  }

  // Render

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        ${stylesString}
      </style>
      <div>
        <h3>${this.gTitle}</h3>
        <p class="clicker-generator-level">Level ${this.gLevel}</p>
        <div class="clicker-generator-progress-bar">
          <div class="clicker-generator-progress"></div>
        </div>
        <p class="clicker-generator-mps">Income ${Helper.formatAmount(this.gMps * this.gLevel)} 💰/s</p>
        <button class='clicker-generator-add-btn' disabled>Improve 💸 ${Helper.formatAmount(this.getCurrentCost())}</button>
      </div>
    `;

    this.shadowRoot.querySelector(".clicker-generator-add-btn").addEventListener("click", () => this.upgrade() );
  }

  // View logic

  updateGeneratorVisibility() {
    if (this.bankSavings >= this.gPrice)
      this.classList.remove('hidden');
  }

  updateUpgradeButtonAvailable() {
    const upgradeBtn = this.shadowRoot.querySelector(".clicker-generator-add-btn")
    if (this.bankSavings >= this.getCurrentCost())
      upgradeBtn.removeAttribute("disabled");
    else
      upgradeBtn.setAttribute("disabled", "");
  }

  upgrade() {
    this.spendFromTheBank(this.getCurrentCost());
    this.gLevel++;
    this.shadowRoot.querySelector(".clicker-generator-level").textContent = `Level ${this.gLevel}`;
    this.shadowRoot.querySelector(".clicker-generator-mps").textContent = `Income ${Helper.formatAmount(this.gMps * this.gLevel)} 💰/s`;
    this.shadowRoot.querySelector(".clicker-generator-add-btn").textContent = `Improve 💸 ${Helper.formatAmount(this.getCurrentCost())}`;
    this.resetProgressBar();
  }

  getCurrentCost() {
    return this.gPrice * 1.3 ** this.gLevel;
  }

  resetProgressBar() {
    clearInterval(this.cooldownTimer);
    this.cooldownTimer = null;
    this.currentCooldownTime = 0;
    this.cooldownTimer = setInterval(() => {
      this.updateProgressBar();
      this.currentCooldownTime += 30;
    }, 30);
  }

  updateProgressBar() {
    const progress = this.shadowRoot.querySelector(".clicker-generator-progress");
    let progressValue = (this.currentCooldownTime) / this.gCooldown;
    if (progressValue >= 1) progressValue = 1.0;
    progress.style.width = `${progressValue * 100}%`;
    if (progressValue >= 1) {
      this.sendQuantityToBank();
    }
  }

}

customElements.define("clicker-generator", ClickerGenerator);
