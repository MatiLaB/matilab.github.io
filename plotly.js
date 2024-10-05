const geojsonUrl = 'regiones.json';

// acá esta el layout de puntitos por cada región
const regiones = [{
    type: 'scattergeo',
    mode: 'markers',
    lon: [-70.6483, -70.3080], // las coords son de la ciudad principal de la región
    lat: [-33.4569, -18.4783],
    text: ['Región Metropolitana', 'Región de Arica y Parinacota'],
    marker: {
        color: ['red', 'blue'], // acá podemos hacer una escala de colores
        size: [10, 20], // podemos escalar el tamaño acá
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
