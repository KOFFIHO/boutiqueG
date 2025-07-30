# users/signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import CustomUser

@receiver(pre_save, sender=CustomUser)
def appliquer_statut_admin(sender, instance, **kwargs):
    if instance.role == "ADMIN":
        instance.is_staff = True
        instance.is_superuser = True
    else:
        # facultatif : retirer superuser pour les autres
        if not instance.is_staff:
            instance.is_superuser = False
