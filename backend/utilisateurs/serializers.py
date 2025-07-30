from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = CustomUser
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "role", "is_active", "is_staff", "is_superuser", "password"
        ]
        read_only_fields = ["is_staff", "is_superuser"]



    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = CustomUser(**validated_data)

        # Définir le mot de passe
        if password:
            user.set_password(password)

        user.save()  # La logique de rôle ADMIN est gérée dans le model.save()
        return user
    
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        role = validated_data.get("role", instance.role)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        # Si le rôle est modifié
        if role == "ADMIN":
            instance.is_superuser = True
            instance.is_staff = True
        else:
            instance.is_superuser = False
            instance.is_staff = False

        instance.save()
        return instance