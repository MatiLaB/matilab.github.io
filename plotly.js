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
                iconRoute: "bitmap.png"
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
                    colorbar: {
                        title: 'Consumo per cápita<br>de Energía (kcal/persona)<br>ㅤ',
                        titlefont: {
                            size: 14,
                        },
                        titleside: 'top',
                        len: 0.6,
                        x: 0.6,
                    },
                    hoverinfo: 'none'
                };

                Plotly.newPlot('mapa', [geoData], layout, config);

                // evento de click en región
                const audio = new Audio('sound.mp3');

                document.getElementById('mapa').on('plotly_click', function(data) {
                    const consumo = data.points[0].z; // consumo por región
                    const volumen = Math.ceil(consumo / 10000000) / 10; // modificar su volumen dado consumo

                    audio.volume = volumen;
                    audio.currentTime = 0; // reinicia cualquier audio que esté sonando
                    audio.play();
                });

                // acá se define la información que se quiere que muestre cada región
                informacion_regiones[2].extrainfo = "La región de Antofagasta tiene el mayor consumo per cápita, ya que es el centro de la industria minera en el país y posee una baja densidad poblacional";
                informacion_regiones[6].extrainfo = "La región Metropolitana, pese a que posee el mayor consumo de energía absoluto, también concentra la mayor cantidad de población, por lo que tiene el segundo menor consumo per cápita.";
                informacion_regiones[15].extrainfo = "La región de Magallanes y Antártica Chilena tiene el segundo mayor consumo per cápita a causa de las actividades de extracción de gas natural y su baja densidad poblacional.";
                
                informacion_regiones[2].iconRoute = "mineria.png"
                informacion_regiones[6].iconRoute = "mapa.png"

                // aquí va el evento de hover para mostrar la información
                document.getElementById('mapa').on('plotly_hover', function(data) {
                    const regionId = data.points[0].location;
                    const regionInfo = informacion_regiones.find(region => region.id === regionId);

                    if (regionInfo) {
                        document.getElementById('region-name').innerText = regionInfo.id;
                        document.getElementById('region-info').innerText = regionInfo.info;
                        document.getElementById('extra-info').innerText = regionInfo.extrainfo;
                        document.getElementById('region-icon').src = regionInfo.iconRoute;
                        document.getElementById('info-box').style.display = 'block';
                    }
                });

                // ocultar el bloque de información cuando se saca el mouse
                document.getElementById('mapa').on('plotly_unhover', function(data) {
                    document.getElementById('info-box').style.display = 'none';
                });
            });
    });