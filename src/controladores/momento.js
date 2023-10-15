const momento = new Date().toLocaleString()


let registro = momento.split(",")

let data = registro[0].split("/")
let hora = registro[1].trim()  // ou .slice(1)


console.log(hora)

let horario = `${data[0]}-${data[1]}-${data[2]} ${hora}`

console.log(horario)
//"data": "2021-08-10 23:40:35",
