from django.db import models


class Address(models.Model):
    class Meta:
        verbose_name_plural = 'addresses'

    formatted_address = models.CharField(max_length=200, unique=True)
    postal_code = models.CharField(max_length=200)
    city = models.CharField(max_length=200, blank=True, null=True)
    state = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=200)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.formatted_address


class Search(models.Model):
    class Meta:
        verbose_name_plural = 'searches'

    expression = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.expression
