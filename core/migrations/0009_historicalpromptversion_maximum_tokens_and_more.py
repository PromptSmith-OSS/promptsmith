# Generated by Django 5.1.1 on 2024-09-25 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_historicalpromptversion'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalpromptversion',
            name='maximum_tokens',
            field=models.IntegerField(default=256),
        ),
        migrations.AddField(
            model_name='historicalpromptversion',
            name='temperature',
            field=models.FloatField(default=0.2),
        ),
        migrations.AddField(
            model_name='historicalpromptversion',
            name='top_p',
            field=models.FloatField(default=0.9),
        ),
        migrations.AddField(
            model_name='promptversion',
            name='maximum_tokens',
            field=models.IntegerField(default=256),
        ),
        migrations.AddField(
            model_name='promptversion',
            name='temperature',
            field=models.FloatField(default=0.2),
        ),
        migrations.AddField(
            model_name='promptversion',
            name='top_p',
            field=models.FloatField(default=0.9),
        ),
    ]
