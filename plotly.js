const geojsonUrl = 'regiones.json';
const poblacion = 'PoblacionChile.csv';


// acá cambiando el csv se lee igual, solo debes cambiar el número
// de row que lees en circleSize y
fetch('ConsumoEnergeticoChile.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').map(row => row.split(',')); 

        const column0 = rows.slice(1).map(row => row[0]);
        console.log(column0)
        const column7 = rows.slice(1).map(row => parseFloat(row[1])); 
        console.log(column7);
        // maximo entre los datos para normalizar
        const max = 76599;
        const circlesSize = column7.map(row => (row/max) * 50)
        console.log(circlesSize)

        // acá esta el layout de puntitos por cada región
        const regiones = [{
            type: 'scattergeo',
            mode: 'markers',
            lon: [-70.3080, -70.1524, -70.3954, -70.3322,
                -71.33947, -71.6197, -70.6483, -71.12452,
                -71.6655, -73.0630, -71.95, -72.66, 73.2416,
                -72.9366, -72.0661, -70.9225],
            lat: [-18.4783, -20.2141, -23.65236, -27.3666,
                -29.95332, -33.0461, -33.4569, -34.3719,
                -35.42694, -36.7727, -36.6166, -38.9, -39.8083,
                -41.47166, -45.57, -53.1625],
            text: column0,
            hoverinfo: 'text',
            marker: {
                color: ['green', 'green', 'green',
                    'green','green', 'green',
                    'green', 'green', 'green',
                    'green', 'green', 'green',
                    'green','green', 'green',
                    'green'
                ], // acá podemos hacer una escala de colores
                size: circlesSize
                // size: [10, 20, 10, 10,
                //     10, 10, 10, 10,
                //     10, 10, 10, 10,
                //     10, 10, 10, 10], // podemos escalar el tamaño acá
            }
        }];

        // acá esta el layout para que se centre el mapa en Chile
        const layout = {
            title: {text: 'Mapa de Chile', x: 0.5,},
            geo: {
                scope: 'chile',
                resolution: 50, // cambiando esto los bordes están mejor o peor definidos
                lonaxis: { range: [-80, -65] },
                lataxis: { range: [-60, -18] },
                landcolor: 'white',
                showcountries: true,
                countrycolor: "Black",
            },
            
            dragmode: false,
            staticPlot: true
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
                    type: 'choropleth', // si se saca esto se muestran los ejes de latitudes y longitudes
                    geojson: geojson,
                };

                Plotly.newPlot('mapa', [geoData, ...regiones], layout, config);
            });

    });



