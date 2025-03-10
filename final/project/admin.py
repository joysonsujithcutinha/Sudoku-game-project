from django.contrib import admin
from .models import Userinfo, Puzzle, PuzzleType, GameStats, Status, Leaderboard, Level

# Register your models here.
admin.site.register(Userinfo)
admin.site.register(Puzzle)
admin.site.register(PuzzleType)
admin.site.register(Level)
admin.site.register(GameStats)
admin.site.register(Status)
admin.site.register(Leaderboard)