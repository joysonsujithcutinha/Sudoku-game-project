# Generated by Django 5.0.3 on 2024-10-09 19:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.CharField(blank=True, max_length=50, primary_key=True, serialize=False)),
                ('level', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='PuzzleType',
            fields=[
                ('type_name', models.CharField(blank=True, max_length=50)),
                ('id', models.CharField(blank=True, max_length=50, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.CharField(blank=True, max_length=50, primary_key=True, serialize=False)),
                ('value', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Userinfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(blank=True, max_length=50, unique=True)),
                ('dob', models.DateField(blank=True)),
                ('country', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Puzzle',
            fields=[
                ('puzzle_id', models.CharField(blank=True, max_length=50, primary_key=True, serialize=False)),
                ('initial_grid', models.TextField(blank=True)),
                ('solution_grid', models.TextField(blank=True)),
                ('level_id', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='project.level')),
                ('puzzletype_id', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='project.puzzletype')),
            ],
        ),
        migrations.CreateModel(
            name='Leaderboard',
            fields=[
                ('id', models.CharField(blank=True, max_length=50, primary_key=True, serialize=False)),
                ('duration', models.DurationField(blank=True)),
                ('level_id', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='project.level')),
                ('puzzletype_id', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='project.puzzletype')),
                ('user_name', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='project.userinfo')),
            ],
        ),
        migrations.CreateModel(
            name='GameStats',
            fields=[
                ('id', models.CharField(blank=True, max_length=50, primary_key=True, serialize=False)),
                ('duration', models.DurationField(blank=True)),
                ('puzzle_id', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='project.puzzle')),
                ('puzzletype_id', models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, to='project.puzzletype')),
                ('status', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='project.status')),
                ('user_name', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='project.userinfo')),
            ],
        ),
    ]
