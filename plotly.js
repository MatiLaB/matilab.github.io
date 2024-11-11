const geojsonUrl = 'regiones.json';
const consumo_relativo = 'ConsumoRelativo.csv';


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
                const audio = new Audio('sound.mp3');
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