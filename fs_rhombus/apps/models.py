from django.db import models

# Create your models here.

class data_interpretor(models.Model):
    title = models.CharField(max_length=100, blank = True)
    message = models.CharField(max_length = 500, blank = True)
    dateTIme = models.CharField(max_length = 500, blank = True)
    #completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title