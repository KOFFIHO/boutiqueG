from django.apps import AppConfig

class UtilisateursConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'utilisateurs'

    def ready(self):
        import utilisateurs.signals  # si tu utilises les signaux
