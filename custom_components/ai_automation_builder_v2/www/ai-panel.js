(function () {
    "use strict";

    class AIBuilderElement extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this._initialized = false;
            this._lastYaml = "";

            this.shadowRoot.innerHTML = `
                <div style="color:white; padding:20px; font-family:sans-serif;">
                    <div style="border: 2px solid #00d1b2; padding: 10px; border-radius: 8px;">
                        ⏳ Inizializzazione in corso...
                    </div>
                </div>
            `;
        }

        set hass(hass) {
            this._hass = hass;
            if (!this._initialized && hass) {
                this._initialized = true;
                this._render();
                this._subscribe();
            }
        }

        connectedCallback() {
            setTimeout(() => {
                if (!this._initialized && window.hass) {
                    this.hass = window.hass;
                }
            }, 500);
        }

        _subscribe() {
            if (!this._hass || !this._hass.connection) {
                console.warn("HA connection non disponibile");
                return;
            }

            const display = this.shadowRoot.getElementById("yaml-output");
            const statusMsg = this.shadowRoot.getElementById("status-msg");
            const generateBtn = this.shadowRoot.getElementById("btn");

            this._hass.connection.subscribeMessage(
                (event) => {
                    if (event.event_type !== "ai_builder_event") return;

                    const yaml = event.data?.yaml ?? "⚠️ Nessun contenuto ricevuto";
                    display.textContent = yaml;
                    this._lastYaml = yaml;
                    display.scrollTop = display.scrollHeight;

                    // Reset loader e pulsanti
                    statusMsg.textContent = "";
                    generateBtn.innerText = "1️⃣ GENERA AUTOMAZIONE";
                },
                {
                    type: "subscribe_events",
                    event_type: "ai_builder_event",
                }
            );
        }

        _render() {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        padding: 20px;
                        background: #111;
                        color: white;
                        min-height: 100vh;
                        font-family: system-ui, sans-serif;
                    }
                    .card {
                        background: #222;
                        border: 1px solid #444;
                        padding: 25px;
                        border-radius: 12px;
                        max-width: 700px;
                        margin: 0 auto;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    }
                    h2 {
                        color: #00d1b2;
                        margin-top: 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    textarea {
                        width: 100%;
                        height: 120px;
                        background: #000;
                        color: #0f8;
                        border: 1px solid #555;
                        padding: 12px;
                        box-sizing: border-box;
                        font-family: monospace;
                        font-size: 14px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        outline: none;
                    }
                    button {
                        width: 100%;
                        padding: 15px;
                        border: none;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 8px;
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                    button.generate-btn {
                        background: #00d1b2;
                        color: #111;
                    }
                    button.copy-btn {
                        background: #0f8;
                        color: #111;
                    }
                    pre {
                        background: #050505;
                        border: 1px solid #333;
                        padding: 15px;
                        margin-top: 15px;
                        white-space: pre-wrap;
                        color: #0f8;
                        font-family: monospace;
                        font-size: 13px;
                        border-radius: 8px;
                        border-left: 4px solid #00d1b2;
                        max-height: 300px;
                        overflow-y: auto;
                    }
                    #status-msg {
                        display: block;
                        margin-top: 5px;
                        color: #0f8;
                        font-size: 13px;
                    }
                </style>

                <div class="card">
                    <h2>🤖 AI Builder</h2>
                    <p>Segui i passaggi per generare e copiare la tua automazione YAML:</p>
                    <ol>
                        <li>Scrivi cosa vuoi automatizzare nel box qui sotto</li>
                        <li>Premi "1️⃣ GENERA AUTOMAZIONE"</li>
                        <li>Premi "2️⃣ COPIA AUTOMAZIONE YAML" per copiarla negli appunti</li>
                    </ol>
                    <textarea
                        id="input"
                        placeholder="Descrivi l'automazione che vuoi creare..."
                    ></textarea>
                    <button class="generate-btn" id="btn">1️⃣ GENERA AUTOMAZIONE</button>
                    <button class="copy-btn" id="copy-btn">2️⃣ COPIA AUTOMAZIONE YAML</button>
                    <span id="status-msg"></span>
                    <pre id="yaml-output">Il codice YAML apparirà qui...</pre>
                </div>
            `;

            const generateBtn = this.shadowRoot.getElementById("btn");
            const copyBtn = this.shadowRoot.getElementById("copy-btn");
            const input = this.shadowRoot.getElementById("input");
            const statusMsg = this.shadowRoot.getElementById("status-msg");
            const display = this.shadowRoot.getElementById("yaml-output");

            // Funzione copia compatibile con tutti i browser
            function copyToClipboard(text) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                } else {
                    const tempTextarea = document.createElement("textarea");
                    tempTextarea.value = text;
                    document.body.appendChild(tempTextarea);
                    tempTextarea.select();
                    try {
                        document.execCommand("copy");
                    } finally {
                        document.body.removeChild(tempTextarea);
                    }
                    return Promise.resolve();
                }
            }

            // GENERA AUTOMAZIONE
            generateBtn.onclick = () => {
                const prompt = input.value.trim();
                if (!prompt) return;

                generateBtn.innerText = "🧠 ELABORAZIONE...";
                generateBtn.disabled = true;
                statusMsg.textContent = "⏳ Attendere generazione YAML...";

                this._hass.callService(
                    "ai_automation_builder_v2",
                    "generate",
                    { prompt }
                ).finally(() => {
                    generateBtn.disabled = false;
                    generateBtn.innerText = "1️⃣ GENERA AUTOMAZIONE";
                });
            };

            // COPIA AUTOMAZIONE YAML
            copyBtn.onclick = () => {
                if (!this._lastYaml || this._lastYaml.startsWith("ERRORE") || this._lastYaml === "Il codice YAML apparirà qui...") {
                    statusMsg.textContent = "⚠️ Nessun YAML disponibile da copiare";
                    return;
                }

                copyToClipboard(this._lastYaml)
                    .then(() => {
                        copyBtn.innerText = "✅ COPIATO!";
                        setTimeout(() => copyBtn.innerText = "2️⃣ COPIA AUTOMAZIONE YAML", 1500);
                    })
                    .catch(() => {
                        copyBtn.innerText = "⚠️ ERRORE";
                        setTimeout(() => copyBtn.innerText = "2️⃣ COPIA AUTOMAZIONE YAML", 1500);
                    });
            };
        }
    }

    if (!customElements.get("ai-builder-element")) {
        customElements.define("ai-builder-element", AIBuilderElement);
    }
})();
