import logging
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.components import panel_custom

DOMAIN = "ai_automation_builder_v2"
_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Configurazione dell'integrazione basata su UI."""
    api_key = entry.data.get("api_key")
    _LOGGER.info("Inizializzazione AI Automation Builder")

    # Registrazione del pannello custom
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path="ai-automation-builder",
        webcomponent_name="ai-builder-element",
        sidebar_title="AI Builder",
        sidebar_icon="mdi:robot",
        module_url="/local/ai-panel.js?v=final_fix",
        embed_iframe=False,
        require_admin=False
    )

    async def async_handle_generate(call):
        """Gestisce la chiamata al servizio di generazione."""
        prompt = call.data.get("prompt", "")
        if not prompt:
            return

        _LOGGER.info("Richiesta generazione ricevuta per: %s", prompt)

        def call_groq():
            """Chiama Groq in thread separato, compatibile 0.11.0."""
            from groq import Client  # 0.11.0 usa Client, non Groq
            client = Client(api_key=api_key)

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Sei un generatore di automazioni per Home Assistant.\n"
                            "Devi rispondere ESCLUSIVAMENTE con codice YAML valido e completo.\n"
                            "Il codice deve essere copiabile direttamente in:\n"
                            "Impostazioni > Automazioni > Modifica in YAML.\n\n"
                            "La struttura DEVE essere ESATTAMENTE questa:\n\n"
                            "alias: <nome automazione>\n"
                            "description: <descrizione>\n"
                            "trigger:\n"
                            "  - platform: state\n"
                            "    entity_id: <entity_id>\n"
                            "condition: []\n"
                            "action:\n"
                            "  - service: <service>\n"
                            "    data:\n"
                            "      message: <testo>\n"
                            "mode: single\n\n"
                            "Regole obbligatorie:\n"
                            "- Non usare markdown\n"
                            "- Non aggiungere testo o spiegazioni\n"
                            "- Usa solo YAML\n"
                            "- Usa nomi di campi validi per Home Assistant\n"
                        )
                    },
                    {"role": "user", "content": prompt}
                ]
            )
            return completion.choices[0].message.content

        try:
            # Esecuzione sicura in thread separato
            res = await hass.async_add_executor_job(call_groq)
            clean_yaml = res.replace("```yaml", "").replace("```", "").strip()

            # Invio al pannello frontend tramite bus eventi
            hass.bus.async_fire("ai_builder_event", {"yaml": clean_yaml})
            _LOGGER.info("YAML generato e inviato correttamente")

        except Exception as e:
            _LOGGER.error("Errore durante la generazione AI: %s", str(e))
            hass.bus.async_fire("ai_builder_event", {"yaml": f"ERRORE: {str(e)}"})

    # Registrazione del servizio
    hass.services.async_register(DOMAIN, "generate", async_handle_generate)
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Scarica l'integrazione."""
    await panel_custom.async_unregister_panel(hass, "ai-automation-builder")
    return True
