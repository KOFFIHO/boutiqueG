from django.contrib.auth.models import AbstractUser
from django.db import models

ROLES = [
    ("ADMIN", "Administrateur"),
    ("GERANT", "Gestionnaire"),
    ("VENDEUR", "Vendeur"),
]

class CustomUser(AbstractUser):
    first_name = models.CharField("Prénom", max_length=150)
    last_name = models.CharField("Nom", max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLES, default="VENDEUR")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.role == "ADMIN":
            self.is_staff = True
            self.is_superuser = True
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
