from django.db import models

# Create your models here.

class Company(models.Model):
    name = models.CharField(max_length=255)
    revenue = models.IntegerField()
    profit = models.IntegerField()
    employees = models.IntegerField()
    country = models.CharField(max_length=255)

    def __str__(self):
        return self.name
