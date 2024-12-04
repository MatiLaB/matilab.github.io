import "https://cdn.plot.ly/plotly-2.34.0.min.js";
import Protobject from './js/protobject.js';

//Ver codigo aqui para entender mas detalles: https://github.com/bellinux/InfoVis2014II/blob/main/presentaciones/codigo-clase11/terremotos.html

//Este codigo abajo agrega todo el HTML y CSS
document.body.insertAdjacentHTML('beforeend', `
        <h2>Consumo de energía per cápita por región en Chile (2020)</h2>
        <div id="triangle"></div>
        <div id="map-container">
            <div id="mapa"></div>
            <div id="contexto"><img src="https://matilab.github.io/bitmap.png" /></div>
        </div>
        <div id="info-box" style="position: absolute; left: 450px; top: 100px; width: 400px; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9; display: none; z-index: 10; transition: opacity 1s ease 1s;">
            <h4 id="region-name"></h4>
            <p id="region-info"></p>
            <div id="consumption-bar-container">
                <div id="consumption-bar"></div>
                <div class="tick-label tick-label-0">0M</div>
                <div class="tick-label tick-label-10">10M</div>
                <div class="tick-label tick-label-20">20M</div>
                <div class="tick-label tick-label-30">30M</div>
                <div class="tick-label tick-label-40">40M</div>
                <div class="tick-label tick-label-50">50M</div>
                <div class="tick-label tick-label-60">60M</div>
            </div>
            <p id="extra-info"></p>
        </div>
        <footer>
            <p> Fuentes:
                <a href="https://si3.bcentral.cl/Siete/ES/Siete/Cuadro/CAP_ESTADIST_REGIONAL/MN_REGIONAL1/EST_REG_POB_TOT">Banco Central de Chile</a>
                y
                <a href="https://energia.gob.cl/pelp/balance-nacional-de-energia">Ministerio de Energía</a>
            </p>
        </footer>

	<style>
	* { font-family: font-family: 'Lagu Sans', sans-serif; }
    		#triangle {
      			width: 0; 
                height: 0; 
                border-left: 10px solid transparent; 
                border-right: 10px solid transparent; 
     			border-bottom: 20px solid #333; 
                transform: rotate(-45deg); 
                position: absolute;  
                pointer-events: none;
                top: 0px; 
                left: 0px; 
                z-index: 9999999999999999;
    		}
            #consumption-bar-container {
                width: 100%;
                background-color: white;
                height: 20px;
                margin-top: 10px;
                margin-bottom: 30px;
                border-radius: 5px;
                overflow: hidden;
            }
            #consumption-bar {
                height: 100%;
                background-color: #ccc;
                width: 0%;
                transition: width 0.3s;
            }
            h2 {
                text-align: center;
                position: relative;
                z-index: 10;
            }
            #map-container {
                position: relative;
                width: 100%;
                height: 100vh;
            }
            #mapa {
                position: relative;
                margin-top: -9vh;
                margin-left: 24vh;
                width: 100%;
                height: 100%;
            }
            #contexto {
                position: absolute;
                top: 0;
                left: 0;
                margin-top: -12.5vh;
                margin-left: 12vh;
                width: 100%;
                height: 70vh;
                pointer-events: none;
                z-index: 99999999;
            }
            #contexto.hidden {
                opacity: 0;
                transform: scale(0.9);
            }
            .estática {
                max-width: 55%;
                height: auto;
            }
            #info-box.visible {
                display: block;
                opacity: 1;
            }
            #consumption-bar-container .tick-label {
                position: absolute;
                font-size: 12px;
                color: black;
            }
            #consumption-bar-container .tick-label-0 {
                left: 2%;
            }
            #consumption-bar-container .tick-label-10 {
                left: calc(2% + (10 / 60) * (92% - 2%));
            }
            #consumption-bar-container .tick-label-20 {
                left: calc(2% + (20 / 60) * (92% - 2%));
            }
            #consumption-bar-container .tick-label-30 {
                left: calc(2% + (30 / 60) * (92% - 2%));
            }
            #consumption-bar-container .tick-label-40 {
                left: calc(2% + (40 / 60) * (92% - 2%));
            }
            #consumption-bar-container .tick-label-50 {
                left: calc(2% + (50 / 60) * (92% - 2%));
            }
            #consumption-bar-container .tick-label-60 {
                left: 92%;
            }
            @media (max-width: 1024px) {
                #mapa {
                    margin-left: 8%;
                    margin-top: -5%;
                }
                #contexto {
                    margin-top: -10vh;
                    margin-left: 5vh;
                    width: 80%;
                    height: 60vh;
                }
            }
            @media (max-width: 768px) {
                #mapa {
                    margin-left: 5%;
                    margin-top: -3%;
                }
                #contexto {
                    margin-top: -8vh;
                    margin-left: 3vh;
                    width: 85%;
                    height: 55vh;
                }
                #info-box.visible {
                    left: 5vw;
                    top: 10vh;
                    width: 80vw;
                }
            }
            @media (max-width: 480px) {
                #mapa {
                    margin-left: 3%;
                    margin-top: -2%;
                }
                #contexto {
                    margin-top: -5vh;
                    margin-left: 2vh;
                    width: 90%;
                    height: 50vh;
                }
                #info-box.visible {
                    left: 5vw;
                    top: 5vh;
                    width: 90vw;
                }
            }
            @media (min-width: 1900px) {
                #mapa {
                    margin-top: -6vh;
                    margin-left: 17vh;
                    height: 90vh;
                }
                #contexto {
                    margin-left: 15vw;
                    height: 95%;
                    width: 95%;
                    margin-top: -10vh;
                }
                #info-box {
                    left: 35vw;
                    top: 7vh;
                    width: 90vw;
                }
            }
            @media (min-width: 1080px) {
                #mapa {
                    margin-top: -12vh;
                    margin-left: 14vw;
                    height: 100vh;
                }
                #contexto {
                    margin-left: 10vw;
                    height: 10%;
                    margin-top: -30.5vh;
                }
                img {
                    margin-left: 27vh;
                    width: 56%;
                    margin-top: 22vh;
                }
                #info-box {
                    left: 18vw;
                    top: 7vh;
                    width: 90vw;
                }
            }
            @media (min-width: 1300px) {
                #mapa {
                    margin-top: -13vh;
                    margin-left: 14vw;
                    height: 100vh;
                }
                #contexto {
                    margin-left: 8vw;
                    height: 90%;
                    margin-top: -25vh;
                }
                img {
                    margin-left: 1vw;
                    width: 71%;
                    margin-top: 21vh;
                }
                #info-box {
                    left: 18vw;
                    top: 7vh;
                    width: 90vw;
                }
            }
            @media (min-width: 1400px) {
                #mapa {
                    margin-top: -13vh;
                    margin-left: 14vw;
                    height: 100vh;
                }
                #contexto {
                    margin-left: 10vw;
                    height: 90%;
                    margin-top: -30vh;
                }
                img {
                    margin-left: 12vw;
                    width: 776px;
                    margin-top: 22vh;
                }
                #info-box {
                    left: 18vw;
                    top: 7vh;
                    width: 90vw;
                }
            }
            @media (min-width: 1280px) {
                #mapa {
                    margin-top: -13vh;
                    margin-left: 14vw;
                    height: 100vh;
                }
                #contexto {
                    margin-left: 10vw;
                    height: 90%;
                    margin-top: -30vh;
                }
                img {
                    width: 775px;
                }
                #info-box {
                    left: 18vw;
                    top: 7vh;
                    width: 90vw;
                }
            }
            @media (min-width: 1920px) {
                #mapa {
                    margin-top: -13vh;
                    margin-left: 14vw;
                    height: 100vh;
                }
                #contexto {
                    margin-left: 6vw;
                    height: 90%;
                    margin-top: -32vh
                }
                img {
                    width: 1280px;
                }
                #info-box {
                    left: 18vw;
                    top: 7vh;
                    width: 90vw;
                }
            }
        </style>
`);

const geojsonUrl = 'https://matilab.github.io/regiones.json';
const consumo_relativo = 'https://matilab.github.io/ConsumoRelativo.csv';

// Acá leo los nombres de las regiones y el consumo relativo 
fetch(consumo_relativo)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').map(row => row.split(';'));

        const nombres_regiones = rows.slice(1).map(row => row[0]);
        console.log(nombres_regiones)
        const consumo_regiones = rows.slice(1).map(row => parseFloat(row[3].replace(',', '.')));
        console.log(consumo_regiones);

        // crear el array de información de las regiones
        const informacion_regiones = nombres_regiones.map((nombre, index) => {
            return {
                id: nombre,
                info: `Consumo: ${consumo_regiones[index].toLocaleString()} kcal/persona.`,
                extrainfo: "lorem ipsum",
            };
        });

        // Máximo entre los datos para normalizar
        const max = Math.max(...consumo_regiones);


        // acá esta el layout para que se centre el mapa en Chile
        const layout = {
            geo: {
                scope: 'chile',
                resolution: 50,
                lonaxis: { range: [-80, -65] },
                lataxis: { range: [-60, -17] },
                landcolor: 'white',
                showcountries: false,
                countrycolor: "Black",
                visible: false
            },
            dragmode: false,
            staticPlot: true,
            annotations: []
        };

        // configuración de plotly
        const config = {
            displayModeBar: false // sacar la barra de herramientas de plotly
        };

        // acá se muestra el mapa
        fetch(geojsonUrl)
            .then(response => response.json())
            .then(geojson => {

                const geoData = {
                    type: 'choropleth',
                    geojson: geojson,
                    locations: nombres_regiones,
                    z: consumo_regiones,
                    featureidkey: 'properties.Region',
                    //text: nombres_regiones, // Agregar esto para mostrar el nombre completo en el hover
                    //hoverinfo: 'text+z',
                    colorscale: 'Reds', // escala, la podemos cambiar
                    showscale: false,
                    hoverinfo: 'none',
                };

                Plotly.newPlot('mapa', [geoData], layout, config);

                // Instanciar el objeto de audio
                const audio = new Audio('https://matilab.github.io/sound.mp3');
                let audioInterval;

                // acá se define la información que se quiere que muestre cada región
                informacion_regiones[0].extrainfo = "Población: 261.779 habitantes."; // Arica 
                informacion_regiones[1].extrainfo = "Población: 406.287 habitantes."; // Tarapacá
                informacion_regiones[2].extrainfo = "Población: 718.232 habitantes."; // Antofagasta
                informacion_regiones[3].extrainfo = "Población: 319.992 habitantes."; // Atacama
                informacion_regiones[4].extrainfo = "Población: 879.267 habitantes."; // Coquimbo
                informacion_regiones[5].extrainfo = "Población: 2.010.849 habitantes."; // Valparaíso
                informacion_regiones[6].extrainfo = "Población: 8.420.729 habitantes."; // Región Metropolitana
                informacion_regiones[7].extrainfo = "Población: 1.017.701 habitantes."; // O'Higgins
                informacion_regiones[8].extrainfo = "Población: 1.162.641 habitantes."; // Maule
                informacion_regiones[9].extrainfo = "Población: 1.681.430 habitantes."; // Biobío
                informacion_regiones[10].extrainfo = "Población: 519.437 habitantes."; // Ñuble
                informacion_regiones[11].extrainfo = "Población: 1.028.201 habitantes."; // La Araucanía
                informacion_regiones[12].extrainfo = "Población: 411.205 habitantes."; // Los Ríos
                informacion_regiones[13].extrainfo = "Población: 907.429 habitantes."; // Los Lagos
                informacion_regiones[14].extrainfo = "Población: 108.306 habitantes."; // Aysén
                informacion_regiones[15].extrainfo = "Población: 183.235 habitantes."; // Magallanes y Antártica Chilena



                // aquí va el evento de hover para mostrar la información
                document.getElementById('mapa').on('plotly_hover', function (data) {
                    const consumo = data.points[0].z; // consumo por región

                    const regionId = data.points[0].location;
                    const regionInfo = informacion_regiones.find(region => region.id === regionId);

                    const coloresRegiones = [
                        'rgb(220, 220, 220)',  // Arica y Parinacota
                        'rgb(245, 187, 145)',  // Tarapacá
                        'rgb(179, 46, 37)',    // Antofagasta
                        'rgb(233, 134, 91)',   // Atacama
                        'rgb(227, 214, 206)',  // Coquimbo
                        'rgb(230, 211, 197)',  // Valparaíso
                        'rgb(220, 220, 219)',  // Metropolitana
                        'rgb(228, 212, 200)',  // O'Higgins
                        'rgb(233, 208, 190)',  // Maule
                        'rgb(228, 212, 199)',  // Biobío
                        'rgb(245, 183, 139)',  // Ñuble
                        'rgb(227, 213, 203)',  // La Araucanía
                        'rgb(243, 197, 162)',  // Los Ríos
                        'rgb(245, 194, 156)',  // Los Lagos
                        'rgb(245, 190, 149)',  // Aysén
                        'rgb(205, 71, 59)'     // Magallanes
                    ];

                    document.getElementById('contexto').style.opacity = 0;

                    if (regionInfo) {
                        document.getElementById('region-name').innerText = regionInfo.id;
                        document.getElementById('region-info').innerText = regionInfo.info;
                        document.getElementById('extra-info').innerText = regionInfo.extrainfo;
                        // document.getElementById('region-icon').src = regionInfo.iconRoute;
                        document.getElementById('info-box').style.display = 'block';
                        setTimeout(function () {
                            document.getElementById('info-box').classList.add('visible');
                        }, 1000);

                        // Calcular y establecer el ancho de la barra de consumo
                        //const consumo = consumo_regiones[regionIndex];
                        const widthPercentage = (consumo / max) * 100;
                        document.getElementById('consumption-bar').style.width = widthPercentage + '%';

                        const regionIndex = nombres_regiones.indexOf(regionId);
                        // Asignar color específico en el orden de colores definido
                        const regionColor = coloresRegiones[regionIndex];
                        document.getElementById('consumption-bar').style.backgroundColor = regionColor;
                    }

                    audio.currentTime = 0;  // Asegurarse de que empieza desde el inicio
                    audio.volume = 0.2;     // Ajustar el volumen (si es necesario)
                    audio.play();

                    // Calcular el intervalo de repetición del audio basado en el consumo
                    const minInterval = 500;  // Tiempo mínimo en ms entre repeticiones
                    const maxInterval = 3000; // Tiempo máximo en ms entre repeticiones
                    const interval = maxInterval - (consumo / max) * (maxInterval - minInterval);

                    // Limpiar cualquier intervalo anterior para evitar superposición de audios
                    clearInterval(audioInterval);

                    // Iniciar el audio a intervalos específicos
                    audioInterval = setInterval(() => {
                        audio.currentTime = 0;
                        audio.play();
                    }, interval);

                });

                // ocultar el bloque de información cuando se saca el mouse
                document.getElementById('mapa').on('plotly_unhover', function (data) {
                    document.getElementById('info-box').style.display = 'none';
                    document.getElementById('info-box').classList.remove('visible');
                    document.getElementById('contexto').style.opacity = 1;
                    // reiniciar audio
                    clearInterval(audioInterval);
                    audio.pause();
                    audio.currentTime = 0;
                });
            });
    });

let triangle = document.getElementById("triangle");

function mapValue(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

// Listen for hand sensor data and map to screen coordinates
Protobject.onReceived((data) => {
    const cursorTop = mapValue(data.y, 0.2, 0.8, 0, window.innerHeight);
    const cursorLeft = mapValue(data.x, 0.2, 0.8, 0, window.innerWidth);

    triangle.style.top = cursorTop + 'px'; // Actualiza la posición vertical del triángulo
    triangle.style.left = cursorLeft + 'px'; // Actualiza la posición horizontal del triángulo

    detectHoverRegion(cursorLeft, cursorTop);
});

var oldRegion = "";
var currentRegion = "";

function detectHoverRegion(x, y) {
    var hoveredElement = document.elementFromPoint(x, y);

    if (!hoveredElement) return; // Early return if no element is detected

    const regionElement = hoveredElement.closest('.choroplethlocation');
  	console.log(hoveredElement);
    if (regionElement) {
        const currentRegion = regionElement.getAttribute('id'); // Get the ID of the region

        if (currentRegion && currentRegion !== oldRegion) {
            console.log("Región seleccionada:", currentRegion); // Log the selected region
            displayRegionInfo(currentRegion); // Perform your action
            oldRegion = currentRegion; // Update the oldRegion
        }
    }
}

function displayRegionInfo(regionId) {
    const regionInfo = informacion_regiones.find(region => region.id === regionId);

    if (regionInfo) {
        document.getElementById('region-name').innerText = regionInfo.id;
        document.getElementById('region-info').innerText = regionInfo.info;
        document.getElementById('extra-info').innerText = regionInfo.extrainfo;

        const consumption = parseFloat(regionInfo.info.match(/[\d.]+/));
        const widthPercentage = (consumption / max) * 100;
        document.getElementById('consumption-bar').style.width = `${widthPercentage}%`;

        document.getElementById('info-box').classList.add('visible');
        document.getElementById('info-box').style.opacity = '1';
    }
}



