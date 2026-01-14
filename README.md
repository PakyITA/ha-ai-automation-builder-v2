# AI Automation Builder v2 by Pasquale

Forked and modified from  
[P1pp89/ha-ai-automation-builder](https://github.com/P1pp89/ha-ai-automation-builder)

Questa versione include:
- Integrazione con Groq 0.11.0
- Pannello web aggiornato
- Copia automatica del codice YAML
- Compatibile con HACS

---

## Installazione tramite HACS (consigliata)

Questa è la modalità più semplice.

### 1️⃣ Aggiungere la repository a HACS

1. Apri Home Assistant
2. Vai su **HACS → Impostazioni → Repository personalizzati**
3. Clicca **Aggiungi**
4. Inserisci:
   - **Repository**:  
     `https://github.com/PakyITA/ha-ai-automation-builder-v2`
   - **Categoria**: `Integrazione`
5. Conferma

### 2️⃣ Installare l’integrazione

1. Vai su **HACS → Integrazioni**
2. Cerca **AI Automation Builder v2**
3. Clicca **Installa**
4. **Riavvia Home Assistant**

### 3️⃣ Aggiungere l’integrazione da Home Assistant

1. Vai su **Impostazioni → Dispositivi e servizi**
2. Clicca **Aggiungi integrazione**
3. Cerca **AI Automation Builder v2**
4. Inserisci la tua **API Key Groq**
5. Conferma

A questo punto troverai il pannello **AI Builder** nella sidebar.

---

## Installazione manuale (senza HACS)

Usa questa modalità solo se non utilizzi HACS.

### 1️⃣ Scaricare il codice

```bash
git clone https://github.com/PakyITA/ha-ai-automation-builder-v2.git

