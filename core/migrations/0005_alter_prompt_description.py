# Generated by Django 5.1.1 on 2024-09-21 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_prompt_project'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prompt',
            name='description',
            field=models.TextField(max_length=1024),
        ),
    ]