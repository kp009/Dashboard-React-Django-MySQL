from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import matplotlib.pyplot as plt
import io, base64

from .models import Company
from .serializers import CompanySerializer

@api_view(['POST'])
def upload_excel(request):
    """Uploads an Excel file and stores data in the database"""
    if 'file' not in request.FILES:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    df = pd.read_excel(file)

    for _, row in df.iterrows():
        Company.objects.create(
            name=row['name'],
            revenue=row['revenue'],
            profit=row['profit'],
            employees=row['employees'],
            country=row['country']
        )

    return Response({"message": "Data uploaded successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def add_company(request):
    """Add new company details manually"""
    serializer = CompanySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_companies(request):
    """Retrieve all companies"""
    companies = Company.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def generate_chart(request, chart_type):
    """Generate and return a filtered chart (bar, pie, scatter)"""
    min_revenue = request.GET.get('min_revenue', 0)
    min_employees = request.GET.get('min_employees', 0)

    companies = Company.objects.filter(revenue__gte=min_revenue, employees__gte=min_employees)
    df = pd.DataFrame(list(companies.values()))

    if df.empty:
        return Response({"error": "No data available for the selected filters"}, status=status.HTTP_400_BAD_REQUEST)

    plt.figure(figsize=(8, 5))

    if chart_type == "bar":
        plt.bar(df["name"], df["revenue"], color="blue")
    elif chart_type == "pie":
        plt.pie(df["revenue"], labels=df["name"], autopct="%1.1f%%")
    elif chart_type == "scatter":
        plt.scatter(df["employees"], df["profit"], color="red")
        plt.xlabel("Employees")
        plt.ylabel("Profit")
    else:
        return Response({"error": "Invalid chart type"}, status=status.HTTP_400_BAD_REQUEST)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode("utf-8")

    return Response({"chart": image_base64})


@api_view(['DELETE'])
def delete_company(request, id):
    try:
        company = Company.objects.get(id=id)
        company.delete()
        return Response({"message": "Company deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Company.DoesNotExist:
        return Response({"message": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
def update_company(request, id):
    try:
        company = Company.objects.get(id=id)
        company.name = request.data.get('name', company.name)
        company.revenue = request.data.get('revenue', company.revenue)
        company.profit = request.data.get('profit', company.profit)
        company.employees = request.data.get('employees', company.employees)
        company.country = request.data.get('country', company.country)
        company.save()
        return Response({"message": "Company updated successfully"}, status=status.HTTP_200_OK)
    except Company.DoesNotExist:
        return Response({"message": "Company not found"}, status=status.HTTP_404_NOT_FOUND)