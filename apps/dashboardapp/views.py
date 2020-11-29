from django.shortcuts import render
from django.shortcuts import HttpResponse
#from django.contrib.auth import authenticate, login
from .forms import UserRegistrationForm, UserEditForm, ProfileEditForm
from .models import Profile
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail, EmailMessage
#from red_social.settings import EMAIL_HOST_USER
#------------2daparte-----------------------
from django.views.generic import TemplateView, ListView, CreateView
from django.urls import reverse_lazy

'''
def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cleaned_data = form.cleaned_data
            user = authenticate(request,
                                username=cleaned_data['usuario'],
                                password=cleaned_data['contraseña'])

        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponse('login exitoso')
            else:
                return HttpResponse('cuenta deshabilitada')
        else:
            print(1)
            return HttpResponse('login fallido')

    else:
        form = LoginForm()
    return render(request, 'cuenta/login.html', {'form': form})
'''

@login_required
def dashboard(request):
    return render(request,
                    'cuenta/dashboard.html',
                    {'section': 'dashboard'}
    )

def register(request):
    
    if request.method == 'POST':
        
        formulario_rellenado = UserRegistrationForm(request.POST)
        if formulario_rellenado.is_valid():
            # se crea un objeto para el nuevo usuario, pero se evita guardar/registar aún
            nuevo_usuario = formulario_rellenado.save(commit=False)
            # se setea la contraseña
            nuevo_usuario.set_password(
                formulario_rellenado.cleaned_data['password']
            )
            #Ahora sí guardamos el objeto nuevo usuario
            nuevo_usuario.save()
            #Crear el perfil de usuario
            Profile.objects.create(user=nuevo_usuario)
            return render(request, 'cuenta/register_done.html', {'nuevo_usuario': nuevo_usuario})
    else:      
        formulario_rellenado = UserRegistrationForm()
    return render(request, 'cuenta/register.html', {'formulario_registro': formulario_rellenado})
        

'''
def enviar_correo(request):
    email = EmailMessage('Asunto','Body del correo',EMAIL_HOST_USER,
    ["supermagnifico090@gmail.com","diplomadosonline.prog@gmail.com"])

    ruta_del_archivo = r'I:\image.jpg'

    email.attach_file(ruta_del_archivo)
    email.send()
    return HttpResponse("Correo enviado")
'''

@login_required
def edit(request):
    if request.method == 'POST':
        formulario_de_usuario = UserEditForm(instance=request.user,
                                data=request.POST)
        formulario_de_perfil = ProfileEditForm(
                                                instance=request.user.profile,
                                                data = request.POST,
                                                files=request.FILES)
        if formulario_de_usuario.is_valid() and formulario_de_perfil.is_valid():
            formulario_de_usuario.save()
            formulario_de_perfil.save()
            
    else:
        formulario_de_usuario = UserEditForm(instance=request.user)
        formulario_de_perfil = ProfileEditForm(instance=request.user.profile)
    
    return render(request, 'cuenta/edit.html', {'user_form':formulario_de_usuario, 
                                                'profile_form': formulario_de_perfil})
        


#-----------------------------------------------------------2parte-------------------------

class listarUsuario(ListView):
    model = Profile
    template_name = "cuenta/listar_usuario.html"
    context_object_name = 'usuarios'
    queryset = Profile.objects.filter(estado=True)
    success_url = reverse_lazy('cuenta:listar_usuario')


def juego(request):
    return render(request,'juego/mijuego.html')