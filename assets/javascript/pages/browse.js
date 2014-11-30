var styles = [{"stylers":[{"saturation":-100}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#0099dd"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#aadd55"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"}]},{}]

var mapEl = $('#map')

var distanceType = 'km'

var mapObj = new GMaps({
    div: '#map',
    lat: mapEl.data('lat'),
    lng: mapEl.data('lng'),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    scaleControl: false,
    zoomControl: true,
    streetViewControl: false,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL
    },
    mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP]
    },
    styles: styles,
    dragend: function() {
        onMapDrag();
    }
});

$(window).load(function(){
    onMapDrag()
})

function onMapDrag() {
    var latLng = getCanvasLatLng()
    $('#activeLatitude').val(latLng.lat)
    $('#activeLongitude').val(latLng.lng)
    $('#activeRadius').val(getCanvasRadius())

    $('#sideMenuForm').request('onRefresh', {
        update: {
            'browse/side-menu': '#partialBrowseSideMenu'
        }
    }).success(function(){
        addMarkersFromSideMenu()
    })
}

function getCanvasRadius() {
    var bounds = mapObj.map.getBounds()
    if (!bounds)
        return  null

    var center = bounds.getCenter()
    var ne = bounds.getNorthEast()

    // r = radius of the earth in statute miles
    var r = (distanceType == "km") ? 6378.1370 : 3963.191

    // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
    var lat1 = center.lat() / 57.2958
    var lon1 = center.lng() / 57.2958
    var lat2 = ne.lat() / 57.2958
    var lon2 = ne.lng() / 57.2958

    // distance = circle radius from center to Northeast corner of bounds
    var distance = r
        * Math.acos(Math.sin(lat1)
        * Math.sin(lat2)
        + Math.cos(lat1)
        * Math.cos(lat2)
        * Math.cos(lon2 - lon1))

    return distance
}

function getCanvasLatLng() {
    var bounds = mapObj.map.getBounds()
    if (!bounds) {
        return {
            lat: false,
            lng: false
        }
    }

    var center = bounds.getCenter()

    return {
        lat: center.lat(),
        lng: center.lng()
    }
}

var markers = []

function addMarkersFromSideMenu() {
    $('#partialBrowseSideMenu .item').each(function() {

        var id = $(this).data('id')
        if (markers[id]) return

        var infoWindowContent = $('[data-infowindow]', this).html()

        markers[id] = mapObj.addMarker({
            lat: $(this).data('lat'),
            lng: $(this).data('lng'),
            title: $(this).data('title'),
            click: function(e) {
                clickMarker(id)
            },
            infoWindow: {
                content: infoWindowContent
            }
        });

    })
}

function clickMarker(id) {
    $('#partialBrowseSideMenu .item[data-id='+id+']')
        .addClass('active')
        .siblings().removeClass('active')
}

$('#partialBrowseSideMenu').on('click', '.item', clickSideMenu)

function clickSideMenu() {
    var id = $(this).data('id')

    if (markers[id]) {
        var marker = markers[id]

        if (marker.infoWindow) {
            mapObj.hideInfoWindows()
            marker.infoWindow.open(mapObj.map, marker);
        }
    }
}
