from django.urls import path
from .views import upload_excel, add_company, get_companies, generate_chart, update_company, delete_company

urlpatterns = [
    path('upload-excel/', upload_excel, name='upload_excel'),
    path('add-company/', add_company, name='add_company'),
    path('get-companies/', get_companies, name='get_companies'),
    path('delete-company/<int:id>/', delete_company, name='delete_company'),
    path('update-company/<int:id>/', update_company, name='update_company'),
    path('generate-chart/<str:chart_type>/', generate_chart, name='generate_chart'),
]
