'use strict';

// Componente principal de la aplicación
// Contiene los componentes <clicker-bank> y <clicker-generator>
// y los datos de los generadores

import Bank from './ClickerBankComponent.js';
import Generator from './ClickerGeneratorComponent.js';

// Array de objetos con los datos de los generadores
import { generators } from "./clicker-data.js";

class ClickerApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.generators = [...generators];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        @import './src/styles/clicker-app.scss';
      </style>
        <h1>Simple Auto-Clicker</h1>
        <clicker-bank class="clicker-bank"></clicker-bank>
        <div class="clicker-generators">
          ${
            // Recorre el array de generadores y por cada uno de ellos
            // crea un componente <clicker-generator> con los atributos
            // title, price, level y mps
            //
            // Utiliza el método map() de los arrays, en este caso
            // crea un nuevo array de strings con el HTML de cada
            // componente <clicker-generator> y se unen con el método join()
            // para crear un único string con todos los componentes

            this.generators.map((generator) => `
                <clicker-generator
                  ${Generator.G_TITLE} = "${generator.title}"
                  ${Generator.G_PRICE} = "${generator.price}"
                  ${Generator.G_LEVEL} = "${generator.level}"
                  ${Generator.G_MPS}   = "${generator.mps}"
                  ${Generator.G_COOLDOWN} = "${generator.cooldown}">
                </clicker-generator>
              `
            ).join('')
          }
        </div>
    `;
  }
}

customElements.define("clicker-app", ClickerApp);
