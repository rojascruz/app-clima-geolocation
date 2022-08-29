const fs = require('fs');

const axios = require('axios');


class Busquedas {

    historial = ['jose'];
    dbPath = './db/database.json';

    constructor() {
        // TODO:  Leer DB si existe
        this.leerDB();
    }

    get getHistorialCapitalizado(){
        
        //Capitalizar cada palabra
        return this.historial.map(lugar => {
            let palabra = lugar.split(' ');
            palabra = palabra.map(p => p[0].toUpperCase() + p.substring(1));

            return palabra.join(' '); 
        })
    }

    get getParamsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY, //'El token de mapbox no tengo el aceso'
            'limit': 4,
            'language': 'es'
        }
    }

    get getParamsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY, //'El token de mapbox no tengo el aceso'
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad (lugar = '') {
        //Peticion HTTP (informacion)

        try {

            const instance = axios.create({
                baseURL: `https//api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.getParamsMapbox
            });

            const resp = await instance.get();
            
    
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

            
        } catch (error) {
            return [];
        }

    }


    async climaLugar (lat, lon) {

        try {
            // Istnace axios.create

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.getParamsOpenWeather, lat, lon}
            });
            // resp.data
            const resp = await instance.get();
            const {weather, main} = resp.data
            return {
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description
            };

        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial( lugar = '') {

        // TODO: Prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en DB
        this.guardarDB();

    }

    guardarDB(){

        const payload ={
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        // Debe de existir...
        if(!fs.existsSync(this.dbPath)){
            return;
        }
    
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info)
        
        this.historial = data.historial;
    }

}










module.exports = Busquedas;