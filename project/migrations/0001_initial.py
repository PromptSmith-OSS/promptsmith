# Generated by Django 5.1 on 2024-09-16 10:28

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('unique_key', models.CharField(max_length=256, unique=True)),
                ('description', models.TextField(max_length=2048)),
            ],
            options={
                'indexes': [models.Index(fields=['unique_key'], name='project_pro_unique__70c51e_idx')],
            },
        ),
        migrations.CreateModel(
            name='ClientPublicKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('public_key', models.CharField(max_length=2048, unique=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            options={
                'indexes': [models.Index(fields=['project'], name='project_cli_project_38fd80_idx')],
            },
        ),
        migrations.CreateModel(
            name='ServerPrivateKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('private_key', models.CharField(max_length=2048, unique=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
            ],
            options={
                'indexes': [models.Index(fields=['project'], name='project_ser_project_0967fe_idx')],
            },
        ),
    ]
