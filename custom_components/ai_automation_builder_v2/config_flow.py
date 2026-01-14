from homeassistant import config_entries
import voluptuous as vol

DOMAIN = "ai_automation_builder_v2"

class AIAutomationConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Gestisce l'inserimento della API Key dalla UI."""
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Primo step della configurazione."""
        if user_input is not None:
            # Crea l'integrazione
            return self.async_create_entry(title="AI Automation Builder", data=user_input)

        # Mostra il modulo
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("api_key"): str,
            }),
        )
