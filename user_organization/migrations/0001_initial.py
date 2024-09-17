# Generated by Django 5.1.1 on 2024-09-17 22:48

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, max_length=512)),
                ('address', models.TextField(blank=True, max_length=256)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DeveloperAPIKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=255)),
                ('api_key_role', models.CharField(choices=[('o', 'Owner'), ('e', 'Editor'), ('v', 'Viewer')], default='v', max_length=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_organization.organization')),
            ],
        ),
        migrations.CreateModel(
            name='UserPermissionOrganization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_role', models.CharField(choices=[('o', 'Owner'), ('e', 'Editor'), ('v', 'Viewer')], default='v', max_length=1)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_organization.organization')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]