"""
URL configuration for final project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from project import views

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin site
    path('', views.IndexPage, name='index'),  # Home/Signin page
    path('signin/',views.SigninPage, name='signin'),
    path('login/', views.SignupPage, name='signup'),  # Signup page (changed name for clarity)
    path('leaderboard/', views.Homepage, name='leaderboard'),  # Leaderboard page (changed URL for clarity)
    path('puzzlemain/', views.Puzzlemain, name='puzzlemain'),  # Puzzle main page
    path('leaderboard/',views.my_view, name='leaderboard'),
    path('rules/', views.RulePage, name='rules'),
    path('solver/', views.SolverPage, name='solver'),
    path('about/', views.AboutPage, name='about'),
    path('tutor/', views.TutorPage, name='tutor'),
]
