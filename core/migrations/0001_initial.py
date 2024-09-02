# Generated by Django 5.1 on 2024-09-02 11:22

import django.contrib.postgres.fields
import django.contrib.postgres.indexes
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Prompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('unique_key', models.CharField(max_length=512, unique=True)),
                ('description', models.TextField(max_length=2048)),
                ('enabled', models.BooleanField(default=True)),
            ],
            options={
                'indexes': [models.Index(fields=['unique_key'], name='core_prompt_unique__10145f_idx'), models.Index(fields=['enabled'], name='core_prompt_enabled_f51741_idx')],
            },
        ),
        migrations.CreateModel(
            name='Segment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('name', models.CharField(max_length=256)),
                ('distinct_ids', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=256), default=list, size=10000000)),
            ],
            options={
                'indexes': [models.Index(fields=['name'], name='core_segmen_name_8d020c_idx'), django.contrib.postgres.indexes.GinIndex(fields=['distinct_ids'], name='core_segmen_distinc_247c6c_gin')],
            },
        ),
        migrations.CreateModel(
            name='PromptVariant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('unique_key', models.CharField(max_length=512, unique=True)),
                ('percentage', models.FloatField()),
                ('selected_version_key', models.CharField(blank=True, null=True)),
                ('prompt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variants', to='core.prompt', to_field='uuid')),
                ('segment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.segment', to_field='uuid')),
            ],
        ),
        migrations.CreateModel(
            name='PromptVersion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('name', models.TextField(max_length=128)),
                ('model_name', models.TextField(max_length=128)),
                ('content', models.TextField(max_length=1000000)),
                ('prompt_variant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='versions', to='core.promptvariant', to_field='uuid')),
            ],
            options={
                'indexes': [models.Index(fields=['name'], name='core_prompt_name_2d7d7d_idx'), models.Index(fields=['model_name'], name='core_prompt_model_n_b8c4a9_idx'), models.Index(fields=['prompt_variant'], name='core_prompt_prompt__0c51ad_idx')],
            },
        ),
        migrations.AddIndex(
            model_name='promptvariant',
            index=models.Index(fields=['prompt'], name='core_prompt_prompt__fb0fa5_idx'),
        ),
    ]
