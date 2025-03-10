from django.shortcuts import render, HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import dateparse
from .models import Puzzle, PuzzleType, Level, GameStats,Status, Leaderboard,Userinfo
import random

def my_view(request):
    current_user = request.user
    context = {
        'user': current_user
    }
    return render(request, 'leaderboard.html', context)

@login_required(login_url='login')
def Homepage(request):
    if request.method == 'POST':
        print(request.POST)
        if request.POST.get('time1') is None:
            puzzletype = request.POST.get('puzz')
            level = request.POST.get('diff')
            puzzletypeid=PuzzleType.objects.filter(type_name=puzzletype).values('id')[0]['id']
            levelid = Level.objects.filter(level=level).values('id')[0]['id']
            context = {
                'uname' : request.user,
                'puzzletype': puzzletype,
                'level': level,
                'data': Leaderboard.objects.filter(puzzletype_id=puzzletypeid,level_id=levelid).order_by('duration')
                }
            return render(request, 'leaderboard.html',context)
        uname = request.user
        puzzleid = request.POST.get('puzzle_id')
        status = None # Needs a few updates
        time1 = request.POST.get('time1')
        puzzletype = request.POST.get('puzzletype')
        level = request.POST.get('level')
        puzzletypeid=PuzzleType.objects.filter(type_name=puzzletype).values('id')[0]['id']
        print(level)
        print(Level.objects.filter(level=level).values('id'))
        levelid = Level.objects.filter(level=level).values('id')[0]['id']
        personal_best = False
        id1 = len(GameStats.objects.all()) + 1
        print('roy')
        print(uname.id)
        gameid = GameStats.objects.create(id=id1, user_name=Userinfo.objects.get(user_name=uname),
                                          puzzle_id=Puzzle.objects.get(puzzle_id=puzzleid), 
                                          status=Status.objects.get(id=1),duration=dateparse.parse_duration(time1),
                                          puzzletype_id = PuzzleType.objects.get(id=puzzletypeid))
        gameid.save()
        # l1 = Leaderboard.objects.get(puzzletype_id = PuzzleType.objects.get(type_name=puzzletype),
        #                              user_name=User.objects.get(user_name=uname),
        #                              level_id=Level.objects.get(id=levelid))
        l1 = Leaderboard.objects.filter(puzzletype_id=puzzletypeid,user_name=Userinfo.objects.get(user_name=uname),level_id=levelid).values('id','duration')
        if len(l1) == 0:
            # create object and save
            id2 = len(Leaderboard.objects.all()) + 1
            l2 = Leaderboard.objects.create(id=id2,puzzletype_id=PuzzleType.objects.get(id=puzzletypeid),
                                     user_name=Userinfo.objects.get(user_name=uname),duration=dateparse.parse_duration(time1),
                                     level_id=Level.objects.get(id=levelid))
            l2.save()
            personal_best = True
        else:
            # get id, get object, update time and save
            current_duration = dateparse.parse_duration(time1)
            existing_duration = l1[0]['duration']
            if current_duration < existing_duration:
                l3 = Leaderboard.objects.filter(id=l1[0]['id'])[0]
                l3.duration = current_duration
                l3.save()
                personal_best = True
            
        context = {
            'gameid' : gameid.id,
            'Duration' : time1,
            'uname' : uname,
            'puzzleid' : puzzleid,
            'status' : status,
            'puzzletype' : puzzletype,
            'level': level,
            'personal_best': personal_best,
            'data': Leaderboard.objects.filter(puzzletype_id=puzzletypeid,level_id=levelid).order_by('duration')
            }
        return render(request,'leaderboard.html',context)
    puzzletypeid=PuzzleType.objects.filter(type_name='4x4').values('id')[0]['id']
    levelid = Level.objects.filter(level='easy').values('id')[0]['id']
    context = {
        'uname' : request.user,
        'puzzletype':'4x4',
        'level': 'easy',
        'data': Leaderboard.objects.filter(puzzletype_id=puzzletypeid,level_id=levelid).order_by('duration')
    }
    
    return render(request, 'leaderboard.html',context)

def RulePage(request):
    return render(request, 'rules.html')

def SolverPage(request):
    return render(request, 'solver.html')

def AboutPage(request):
    return render(request, 'about.html')

def IndexPage(request):
    return render(request, 'index.html')

def TutorPage(request):
    puzzle_type = request.POST.get('puzzletype', '9x9')
    difficulty = request.POST.get('dl', 'easy')
    puzzletypeid = PuzzleType.objects.filter(type_name=puzzle_type).values('id')[0]['id']
    levelid = Level.objects.filter(level=difficulty).values('id')[0]['id']
    mydata = Puzzle.objects.filter(puzzletype_id=puzzletypeid, level_id=levelid).values_list('initial_grid', 'solution_grid','puzzle_id','puzzletype_id')
    index = random.randint(0, len(mydata) - 1)
    initialgrid = mydata[index][0]
    solutiongrid = mydata[index][1]
    puzzle_id = mydata[index][2]
    puzzletype_id = mydata[index][3]
   
    
    # Render the puzzle main template with the parameters
    context = {
        'puzzletype': puzzle_type,
        'difficulty': difficulty,
        'initialgrid': initialgrid,
        'solutiongrid': solutiongrid,
        'puzzle_id' : puzzle_id,
        'puzzletype_id': puzzletype_id
    }
    return render(request, 'tutor.html',context)

@login_required(login_url='login')
def Puzzlemain(request):
    puzzle_type = request.POST.get('puzzletype', 'xyz')
    difficulty = request.POST.get('dl', 'xyz')
    if  difficulty=='xyz' or puzzle_type == 'xyz':
        context={
            'puzzletype': 'xyz',
            'difficulty': 'xyz',
            'puzzle_id': 'xyz'
        }
        return render(request,'puzzlemain.html',context)

    puzzletypeid = PuzzleType.objects.filter(type_name=puzzle_type).values('id')[0]['id']
    levelid = Level.objects.filter(level=difficulty).values('id')[0]['id']
    mydata = Puzzle.objects.filter(puzzletype_id=puzzletypeid, level_id=levelid).values_list('initial_grid', 'solution_grid','puzzle_id','puzzletype_id')
    index = random.randint(0, len(mydata) - 1)
    initialgrid = mydata[index][0]
    solutiongrid = mydata[index][1]
    puzzle_id = mydata[index][2]
    puzzletype_id = mydata[index][3]
   
    
    # Render the puzzle main template with the parameters
    context = {
        'puzzletype': puzzle_type,
        'difficulty': difficulty,
        'initialgrid': initialgrid,
        'solutiongrid': solutiongrid,
        'puzzle_id' : puzzle_id,
        'puzzletype_id': puzzletype_id
    }
    
    return render(request, 'puzzlemain.html', context)

def SignupPage(request):
    if request.method == 'POST':
        uname = request.POST.get('username')
        name = request.POST.get('name')
        email = request.POST.get('email')
        dob = request.POST.get('dob')
        country = request.POST.get('country')
        pass1 = request.POST.get('password')
        pass2 = request.POST.get('cnfpassword')
        if pass1 != pass2:
            messages.error(request, 'Both passwords are not matching')
        else:   
            try:
                my_user = User.objects.create_user(uname, email, pass1)
                my_user.first_name = name
                my_user.save()
                print('here')
                print(f'zzz{dob}zzz')
                userid = Userinfo.objects.create(user_name=uname,
                                          dob=dob, 
                                          country=country
                                          )
                print('there')
                userid.save()
                return redirect('signin')
            except Exception as e:
                if 'UNIQUE constraint failed: auth_user.username' in str(e):
                    messages.error(request, "Username already taken")
                else:
                    messages.error(request, f"New error: {str(e)}")
        
    return render(request, 'login.html')

def SigninPage(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        pass1 = request.POST.get('password')
        user = authenticate(request, username=username, password=pass1)
        
        if user is not None:
            login(request, user)
            return redirect('leaderboard')
        else:
            messages.error(request, 'Username and password error')
            
    return render(request, 'signin.html')

