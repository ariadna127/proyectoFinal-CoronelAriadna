let alumnos = [];

fetch("./json/alumnos.json")
.then(response => response.json())
.then(data => {
    alumnos = data;
    cargarListadoAlumnos(alumnos);
})


//En esta seccion traemos los elementos del DOM


const seccionPrincipal = document.getElementById("seccion-principal");
const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("contraseña");
const inputIngresar = document.getElementById("ingresar");
const formIngresoDocente = document.getElementById("ingreso-docente");
const contenedorAlumnos = document.getElementById("contenedor-alumnos");
const botonSalir = document.getElementById("salir");
let botonesDarBaja = document.querySelectorAll(".buton-baja");
const parrafoIngreso = document.getElementById("p-form-ingreso");
const btnRegistrarAlumno = document.querySelector("#boton-registro-alumno");
const contenedorFormRegistro = document.querySelector("#div-form-registro");


const formRegistro = document.querySelector("#form-registro");
const nombreAlumno = document.querySelector("#nombre-alumno");
const nota1M = document.querySelector("#primer-trimestreM");
const nota2M = document.querySelector("#segundo-trimestreM");
const nota3M = document.querySelector("#tercer-trimestreM");


const nota1L = document.querySelector("#primer-trimestreL");
const nota2L = document.querySelector("#segundo-trimestreL");
const nota3L = document.querySelector("#tercer-trimestreL");

const nota1C = document.querySelector("#primer-trimestreC");
const nota2C = document.querySelector("#segundo-trimestreC");
const nota3C = document.querySelector("#tercer-trimestreC");


//variables global

let seccionPrincialClase;
let contenedorAlumnosClase;


//Funcion para agregar propiedad promedio al arreglo Materias del cada objeto del arreglo Alumnos
function calcularPromedio() {
    //Primero accedemos a cada alumno dentro del array alumnos
    alumnos.forEach(alumno => {
        //accedemos al arreglo materias que esta dentro de cada alumno
        alumno.materias.forEach(materia => {
            materia.promedio = Number(((materia.nota1 + materia.nota2 + materia.nota3) / 3).toFixed(2));
        })
    })
}

calcularPromedio();


//Funcion para mostrar listado de alumnos en el DOM
function cargarListadoAlumnos(listaAlumnos) {
    contenedorAlumnos.innerHTML = "";
    //Primero eliminamos la clase disabled para q el contenedor aparezca el el DOM y no tenga display none
    contenedorAlumnos.classList.remove("disabled");
    contenedorFormRegistro.classList.add("disabled");

    botonSalir.classList.remove("disabled");
    const h2Contenedor = document.createElement("h2");
    h2Contenedor.innerText = "LISTADO DE ALUMNOS REGISTRADOS";
    contenedorAlumnos.appendChild(h2Contenedor);

    //Accedemos al arreglo 
    listaAlumnos.forEach(alumno => {
        const divAlumno = document.createElement("div");
        divAlumno.classList.add("alumno");
        divAlumno.innerHTML = `
        <h3>${alumno.nombre}</h3>
        `;
        const divMaterias = document.createElement("div");
        divMaterias.classList.add("materias");

        alumno.materias.forEach(materia => {
            const divMateria = document.createElement("div");
            divMateria.classList.add("materia");
            divMateria.innerHTML = `
                        <h3>Materia: ${materia.materia}</h3>
                        <p>Primer trimestre: ${materia.nota1}</p>
                        <p>Segundo trimestre: ${materia.nota2}</p>
                        <p>Tercer trimestre: ${materia.nota3}</p>
                        <p>Promedio general: ${materia.promedio}</p>
        `;
            divMaterias.appendChild(divMateria);
        })

        divAlumno.appendChild(divMaterias);

        const botonBaja = document.createElement("button");
        botonBaja.classList.add("buton-baja");
        botonBaja.setAttribute("id", `${alumno.id}`);
        botonBaja.textContent = "Dar de baja";

        divAlumno.appendChild(botonBaja);
        contenedorAlumnos.appendChild(divAlumno);

    })

    actualizarBotonesDarBaja();
    //Guardamos en el localStorage el arreglo alumnos al final de la funcion
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
    setSeccionPrincipalLs();
    setContenedorAlumnosLs();
}

const setSeccionPrincipalLs = () =>{
    //Verificamos y guardamos en seccionPrincipalClase si seccionPrincipal tiene la clase disabled
    seccionPrincialClase = seccionPrincipal.classList.contains("disabled");
    //Guardamos en el localStorage seccionPrincipalClase la cual almacena un valor booleano
    localStorage.setItem("seccion-principal", seccionPrincialClase);
}

const setContenedorAlumnosLs = () => {
    contenedorAlumnosClase = contenedorAlumnos.classList.contains("disabled");
    localStorage.setItem("contenedor-alumnos", contenedorAlumnosClase);
}

//esta funcion ocurre cuando hacemos click en el boton INGRESAR
function ingresarAlListado(e) {
    e.preventDefault();
    if (inputUsuario.value === "docente" && inputContraseña.value === "12345678") {
        seccionPrincipal.classList.add("disabled");
        cargarListadoAlumnos(alumnos);
        formIngresoDocente.reset();
    } else {
        parrafoIngreso.innerText = "Usuario o contraseña inválido. Por favor vuelve a escribir un usuario y contraseña";
    }

}

const actualizarBotonesDarBaja = () => {
    //hacemos esto porque los botones recien existen en el DOM cuando cargamos los alumnos
    botonesDarBaja = document.querySelectorAll(".buton-baja");

    //y los traemos para poder darles eventos
    //con un ForEach ponemos un escuchador para cada boton 
    botonesDarBaja.forEach(boton => {
        boton.addEventListener("click", darDeBajaAlumno);
    })
}


const darDeBajaAlumno = (e) => {
    //obetenemos el id del boton y lo parseamos porque nos devuelve un tipo de dato en forma de string
    const idBotonBaja = Number(e.currentTarget.id);
    const alumnoaEliminar = alumnos.find(alumno => alumno.id === idBotonBaja);
    Swal.fire({
        title: "Eliminar del listado",
        text:`¿Estas seguro que deseas dar de baja al alumno ${alumnoaEliminar.nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(122, 3, 3)",
        cancelButtonColor: "orange",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        iconColor: "rgb(122, 3, 3)",
        color: "white",
        background: "rgb(7, 7, 41)",
    }).then((result) => {
        if (result.isConfirmed) {
            //obetenemos el index
        const index = alumnos.findIndex(alumno => alumno.id === idBotonBaja);
        //eliminamos el elemento de alumnos
        alumnos.splice(index, 1);
        console.log(alumnos);
        cargarListadoAlumnos(alumnos);
        Toastify({
            text: "Alumno eliminado.",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "rgb(122, 3, 3)",
                color: "orange"
            }
        }).showToast();
        }
    })
    
}

const mostrarRegistoAlumno = () =>{
    contenedorFormRegistro.classList.remove("disabled");
    seccionPrincipal.classList.add("disabled");
    setSeccionPrincipalLs();
    botonSalir.classList.remove("disabled");
    setContenedorAlumnosLs();
}


//Funcion para obetener los datos del LocalStorage
const getAlumnosStorage = () => {
    //los parseamos porque estaban en formaton JSON
    const alumnosLS = JSON.parse(localStorage.getItem("alumnos"));
    return alumnosLS
}


//Funcion para obtener el estado de la variable seccion principal
const getSeccionPrincipal = () => {
    //creamos una variable donde almacenamos lo que obtenemos del LS con la clave "seccion-principal"
    const seccionPrincipalLS = localStorage.getItem("seccion-principal")
    //como el LS convierte todos los valores a string, comparamos con "true" en forma de string
    if (seccionPrincipalLS === "true") {
        seccionPrincipal.classList.add("disabled");
        const contenedorAlumnosLS = localStorage.getItem("contenedor-alumnos");
        if (contenedorAlumnosLS === "true") {
            console.log("deberia cargar el registro");
            mostrarRegistoAlumno();
        }else{
            console.log("deberian cargar los alumnos");
            //guardamos lo que nos returna la funcion getalumnosstorage en esa variable
        const alumnosStorage = getAlumnosStorage();
        //verificamos q dentro de alumnos storage haya algo y no este vacio
        if (alumnosStorage) {
            //cargamos los datos de alumnosStorage dentro de alumnos
            alumnos = alumnosStorage;
        }
        cargarListadoAlumnos(alumnos);
        }

    } else {
        contenedorAlumnos.classList.add("disabled");
        botonSalir.classList.add("disabled");
        //guardamos lo que nos returna la funcion getalumnosstorage en esa variable
        const alumnosStorage = getAlumnosStorage();
        //verificamos q dentro de alumnos storage haya algo y no este vacio
        if (alumnosStorage) {
            //cargamos los datos de alumnosStorage dentro de alumnos
            alumnos = alumnosStorage;
        }
    }
}

const agregarAlumno = () =>{
    const idAlumnoNuevo = alumnos.length;

    const materia1 = {
        materia: "Matematicas",
        nota1: nota1M.value,
        nota2: nota2M.value,
        nota3: nota3M.value
    }
    const materia2 = {
        materia: "Lengua",
        nota1: nota1L.value,
        nota2: nota2L.value,
        nota3: nota3L.value
    }
    const materia3 = {
        materia: "Ciencias",
        nota1: nota1C.value,
        nota2: nota2C.value,
        nota3: nota3C.value
    }
    
    const materias = [
        materia1,
        materia2,
        materia3
    ];
    const alumno = {
        id: idAlumnoNuevo,
        nombre: nombreAlumno.value,
        materias: materias,
    };
    alumno.materias.forEach(materia => {
        materia.promedio = ((Number(materia.nota1) + Number(materia.nota2) + Number(materia.nota3))/3).toFixed(2);
    })
    alumnos.push(alumno);
}


//EVENTOS

//Cuando la pagina se recarga ocurre este evento
document.addEventListener("DOMContentLoaded", () => {
    //llamamos a la funcion getSeccionPrincipal
    getSeccionPrincipal();

})

//Cuando hacemos click en el boton submit del formulario ingreso docente se llama a este evento y llamamos a la funcion ingresar al Listadp
formIngresoDocente.addEventListener("submit", ingresarAlListado);

//Evento para salir de la lista de alumnos y volver al ingreso del docente
botonSalir.addEventListener("click", () => {
    contenedorAlumnos.classList.add("disabled");
    seccionPrincipal.classList.remove("disabled");
    contenedorFormRegistro.classList.add("disabled");
    botonSalir.classList.add("disabled");
    //Verificamos y guardamos en seccionPrincipalClase si seccionPrincipal tiene la clase disabled
    seccionPrincialClase = seccionPrincipal.classList.contains("disabled");
    //Guardamos en el localStorage seccionPrincipalClase la cual almacena un valor booleano
    localStorage.setItem("seccion-principal", seccionPrincialClase);
})

//Evento para mostrar el contenedor de registrar alumno
btnRegistrarAlumno.addEventListener("click", mostrarRegistoAlumno);

//Evento para enviar los valores del form registro y agregar el alumno al array alumnos

formRegistro.addEventListener("submit", (e) =>{
    e.preventDefault();
    agregarAlumno();
    Swal.fire({
        icon: "success",
        title: "Alumno registrado",
        text: "El alumno ha sido añadido al listado con éxito.",
        iconColor: "rgb(7, 7, 41)",
        color: "white",
        background: "orange",
        confirmButtonColor: "rgb(7, 7, 41)"
        
    })
    formRegistro.reset();
});