# Generated by Django 5.1.1 on 2024-09-16 23:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_prompt_uuid_alter_promptvariant_uuid_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='promptversion',
            name='model_name',
        ),
        migrations.AddField(
            model_name='promptvariant',
            name='llm_model_name',
            field=models.TextField(blank=True, max_length=128, null=True),
        ),
    ]