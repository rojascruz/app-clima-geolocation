require('dotenv').config()
// .env es para crear una variable de entorne y se pondra el MAPBOX_KEY

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// console.log(process.env.MAPBOX_KEY);

const main = async() => {
    

    const busquedas = new Busquedas()
    let opt;

    do {
        
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscar los lugarares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                
                // Este if es cuando preciona 0 lo continua y evita errores
                if(id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);
                
                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.climaLugar(18.357450, -66.111000); // los parametros se cambiar por (lugarSel.lat, lugarSel.lon)
                // console.log(clima);

                // Mostrar resultado
                console.clear();
                console.log('\nInformacion del lugar\n'.green);
                console.log('Ciudad: ', ); // adentro del parentesis va (lugarSel.nombre) tengo que tener el token del mapbox
                console.log('Lat: ', ); // adentro del parentesis va (lugarSel.lat) tengo que tener el token del mapbox
                console.log('Lng: ', ); // adentro del parentesis va (lugarSel.lng) tengo que tener el token del mapbox
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Maxima: ', clima.max);
                console.log('Como esta el clima hoy:', clima.desc.green);
            break;
        
            case 2:
                
                // busquedas.historial.forEach((lugar, i) => {
                busquedas.getHistorialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
            break;
        }



        if(opt !== 0)  await pausa();
        
    } while (opt != 0);


   
}


main();
