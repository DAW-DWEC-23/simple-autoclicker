"use strict";

import Helper from "./ClickerHelper.js";

export default class ClickerBankComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.bankSavings = 0;
  }

  connectedCallback() {
    document.addEventListener(Helper.MsgBankAdd, this);
    document.addEventListener(Helper.MsgBankSubtract, this);
    this.render();
  }

  handleEvent(event) {
    if (event.type === Helper.MsgBankAdd) {
      this.bankSavings += event.detail.quantity;
      this.dispatchCustomEventAddBankSavings(this.bankSavings);
      this.updateSavings();
    }
    if (event.type === Helper.MsgBankSubtract) {
      this.bankSavings -= event.detail.quantity;
      this.dispatchCustomEventAddBankSavings(this.bankSavings);
      this.updateSavings();
    }
  }

  dispatchCustomEventAddBankSavings(quantity) {
    const eventMessage = new CustomEvent(Helper.MsgBankUpdate, {
      detail: {
        bankSavings: quantity,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(eventMessage);
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        @import './src/styles/clicker-bank.scss';
      </style>
      <h3>🏦</h3>
      <p class="clicker-bank-savings">💵 ${Helper.formatAmount(
        this.bankSavings
      )}</p>
    `;
  }

  updateSavings() {
    const savings = this.shadowRoot.querySelector(".clicker-bank-savings");
    savings.innerHTML = `💵 ${Helper.formatAmount(this.bankSavings)}`;
  }
}

customElements.define("clicker-bank", ClickerBankComponent);
