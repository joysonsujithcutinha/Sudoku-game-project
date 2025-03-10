from django.db import models

class Userinfo(models.Model):
    user_name = models.CharField(max_length=50, unique=True, blank=True)
    dob = models.DateField(blank=True)
    country = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.user_name
    
class PuzzleType(models.Model):
    type_name = models.CharField(max_length=50, blank=True)
    id = models.CharField(max_length=50, primary_key=True, blank=True)

    def __str__(self):
        return self.type_name
    
class Level(models.Model):
    id = models.CharField(max_length=50,primary_key=True, blank=True)
    level = models.CharField(max_length=50, blank=True)
    def __str__(self):
        return self.level

class Puzzle(models.Model):
    puzzle_id = models.CharField(max_length=50,primary_key=True, blank=True)
    puzzletype_id = models.ForeignKey(PuzzleType, on_delete=models.CASCADE, default=None,blank=True)
    initial_grid = models.TextField(blank=True)
    solution_grid = models.TextField(blank=True)
    level_id = models.ForeignKey(Level, on_delete=models.CASCADE, default=None,blank=True)

    def __str__(self):
        return self.puzzle_id
    
class Status(models.Model):
    id = models.CharField(max_length=50, primary_key=True, blank=True)
    value = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.id
    
class GameStats(models.Model):
    id = models.CharField(max_length=50, primary_key=True, blank=True)
    user_name = models.ForeignKey(Userinfo, on_delete=models.CASCADE, blank=True)
    puzzle_id = models.ForeignKey(Puzzle, on_delete=models.CASCADE, blank=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, blank=True)
    duration = models.DurationField(blank=True)
    puzzletype_id = models.ForeignKey(PuzzleType, on_delete=models.CASCADE, default=None,blank=True)

    def __str__(self):
        return self.id


class Leaderboard(models.Model):
    id = models.CharField(max_length=50, primary_key=True, blank=True)
    puzzletype_id = models.ForeignKey(PuzzleType, on_delete=models.CASCADE, default=None,blank=True)  # Use ForeignKey to PuzzleType
    user_name = models.ForeignKey(Userinfo, on_delete=models.CASCADE, blank=True)
    duration = models.DurationField(blank=True)
    # duration = models.ForeignKey(GameStats, on_delete=models.CASCADE, blank=True)
    level_id = models.ForeignKey(Level, on_delete=models.CASCADE, default=None,blank=True)

    def __str__(self):
        return self.id
