# AI Automation Builder v2

AI Automation Builder v2 è un’integrazione per Home Assistant che utilizza modelli AI
(per mezzo di Groq) per generare **automazioni Home Assistant in YAML** partendo da
una descrizione in linguaggio naturale.

Questo progetto è un **fork evolutivo** del lavoro originale di  
[P1pp89/ha-ai-automation-builder](https://github.com/P1pp89/ha-ai-automation-builder),  
a cui vanno tutti i crediti per l’idea e l’implementazione iniziale.

---

## Funzionalità principali

- Generazione automatica di automazioni YAML per Home Assistant
- Integrazione con Groq (SDK 0.11.0)
- Pannello dedicato nella sidebar di Home Assistant
- Copia diretta del codice YAML generato
- Configurazione tramite UI
- Compatibile con HACS

---

## Installazione tramite HACS (consigliata)

### 1. Aggiungere la repository a HACS

1. Apri Home Assistant
2. Vai su **HACS → Impostazioni → Repository personalizzati**
3. Clicca **Aggiungi**
4. Inserisci:
   - **Repository**:  
     `https://github.com/PakyITA/ha-ai-automation-builder-v2`
   - **Categoria**: `Integrazione`
5. Conferma

### 2. Installare l’integrazione

1. Vai su **HACS → Integrazioni**
2. Cerca **AI Automation Builder v2**
3. Clicca **Installa**
4. **Riavvia Home Assistant**

### 3. Configurare l’integrazione

1. Vai su **Impostazioni → Dispositivi e servizi**
2. Clicca **Aggiungi integrazione**
3. Cerca **AI Automation Builder v2**
4. Inserisci la tua **API Key Groq**
5. Conferma

Dopo la configurazione, il pannello **AI Builder** comparirà nella sidebar.

---

## Installazione manuale (senza HACS)

### 1. Clonare la repository

```bash
git clone https://github.com/PakyITA/ha-ai-automation-builder-v2.git
```
2. Copiare i file

Copia la cartella:

custom_components/ai_automation_builder_v2


in:

/config/custom_components/


La struttura finale deve essere:

/config/custom_components/ai_automation_builder_v2/
├── __init__.py
├── config_flow.py
├── const.py
├── manifest.json
├── services.yaml
└── www/
    └── ai-panel.js

3. Riavviare Home Assistant
4. Aggiungere l’integrazione

Vai su Impostazioni → Dispositivi e servizi

Clicca Aggiungi integrazione

Cerca AI Automation Builder v2

Inserisci la API Key Groq

Ottenere una API Key Groq

Questa integrazione richiede una API Key Groq per poter generare automazioni tramite AI.

1. Creare un account Groq

Vai su https://www.groq.com

Registrati o effettua il login.

2. Generare la API Key

Accedi al tuo dashboard Groq.

Cerca la sezione API Keys o Impostazioni → API.

Clicca Crea nuova API Key.

Copia la chiave generata in un posto sicuro.

3. Inserire la API Key in Home Assistant

Vai su Impostazioni → Dispositivi e servizi → Aggiungi integrazione → AI Automation Builder v2

Incolla la tua API Key Groq nel campo richiesto.

Conferma.

Dopo questo passaggio, l’integrazione potrà comunicare con Groq e generare automazioni YAML.

Utilizzo

Apri il pannello AI Builder dalla sidebar

Descrivi l’automazione che vuoi creare

Premi 1️⃣ GENERA AUTOMAZIONE

Premi 2️⃣ COPIA AUTOMAZIONE YAML

Incolla il codice in
Impostazioni → Automazioni → Modifica in YAML

Crediti

Questo progetto deriva dal lavoro originale di P1pp89.
Questa versione introduce aggiornamenti tecnici, miglioramenti UI e compatibilità
con le versioni moderne di Home Assistant.

Supporto

Per bug, suggerimenti o miglioramenti apri una issue su:
https://github.com/PakyITA/ha-ai-automation-builder-v2
