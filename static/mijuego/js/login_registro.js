const boton_login = document.querySelector("#login_boton")
const boton_registro = document.querySelector("#registro_boton")
const div_registro_usuario = document.querySelector("#registro")

const div_login = document.querySelector("#login")

boton_registro.onclick=function(){

        div_login.style.display="none";
        div_registro_usuario.style.display = "block";
        
}

boton_login.onclick = function(){
   
        div_login.style.display = "block";
        div_registro_usuario.style.display = "none";
        
}       