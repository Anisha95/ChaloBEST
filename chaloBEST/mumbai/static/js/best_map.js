var jsonLayer;

$(function() {
    $('.listfilter_input').keyup(function() {
        var val = $(this).val();
        var $rows = $(this).parents("table").find(".listItem");
        $rows.each(function() {
            var thisTxt = $(this).text();
            //console.log(thisTxt);
            if (thisTxt.toLowerCase().indexOf(val.toLowerCase()) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });

    
    $('.stopsTable').delegate('.listItem', 'mouseover', function(e) {
        var $t = $(this);
        //console.log($t);
        var id = $t.attr("data-id");
        //console.log(id);
        //console.log(id);
        var feat = getFeatureById(id);
        if (feat) {        
            feat.fire("mouseover");
        }
    });    

    $('.stopsTable').delegate('.listItem', 'mouseout', function(e) {
        var $t = $(this);
        //console.log($t);
        var id = $t.attr("data-id");
        //console.log(id);
        var feat = getFeatureById(id);
        if (feat) {        
            feat.fire("mouseout");
        }
    });    

});

//get feature on map based on feature id
function getFeatureById(feature_id) {
    var ret = false;
    jsonLayer.eachLayer(function(layer) {
        if (layer.feature.properties.id == feature_id) {
            ret = layer;
        }
    });
    return ret;
}


function loadStopsGeojson(geojson) {
   var cleanedGeoJSON = getCleanedGeoJSON(geojson);
   jsonLayer = L.geoJson(cleanedGeoJSON, {
        onEachFeature: function(feature, layer) {
            var url = feature.properties.url;
            layer.on("click", function(e) {
                location.href = url;
            });
            layer.on("mouseover", function(e) {
                var lon = layer.feature.geometry.coordinates[0];
                var lat = layer.feature.geometry.coordinates[1];
                //console.log(lat, lon);
                var latlng = new L.LatLng(lat, lon);
                //console.log(latlng);
                //console.log(layer.feature);
                var props = layer.feature.properties;
                var popup = L.popup({offset: new L.Point(0,-35)})
                    .setLatLng(latlng)
                    .setContent('<p>' + props.display_name + '<br>' + props.name_mr + '<br>' + props.routes + '</p>');
                map.openPopup(popup);
            });
            layer.on("mouseout", function(e) {
                map.closePopup();
            });

        }
    }).addTo(map);
}

function getCleanedGeoJSON(geojson) {
    var cleanedFeatures = [];

    //FIXME: slightly weird hack to deal with different types of GeoJSON objects
    //being passed.
    if (geojson['type'] !== 'FeatureCollection') {
        return geojson;
    }

    var currentFeatures = geojson.features;
    $.each(currentFeatures, function(i, v) {
        if (!$.isEmptyObject(v.geometry)) {
            cleanedFeatures.push(v);
        }
    });
    geojson.features = cleanedFeatures;
    return geojson;
}

