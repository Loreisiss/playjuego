from django.db import models
from django.conf import settings

class Profile(models.Model):
    id = models.AutoField(primary_key = True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)

    date_of_birth = models.DateField(blank=True, null=True)

    photo = models.ImageField(upload_to='users/%Y/%m/%d',
                                blank=True)
    
    estado  =  models.BooleanField ( 'Estado' , default= True )

    def __str__(self):
        return "{}".format(self.user.username)