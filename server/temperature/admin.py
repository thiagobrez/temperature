from django.contrib import admin
from .models import *


class SearchAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


class AddressAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


admin.site.register(Search, SearchAdmin)
admin.site.register(Address, AddressAdmin)
