console.log("this is initScript")

var google = google || {};
var mapObjects = {}
InitAutocompleteSearch('#autocomplete-location-new')

function InitAutocompleteSearch(inputElem, mapElem) {
    var auto = getMapObject(inputElem, "autocomplete");
    console.log("auto: ", auto)
    if (!auto) {
        var input = document.querySelector(inputElem)
        console.log(input)
        var autocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: { country: 'au' } });
        setMapObject(inputElem, "autocomplete", autocomplete);
        console.log(autocomplete)
        google.maps.event.addListener(autocomplete, 'place_changed', async function () {
            var place = autocomplete.getPlace();
            console.log(place)
            if (!place || !place.geometry) {
                $(inputElem).data("validated-place", "").trigger("mcd:autocomplete", {});
                return;
            }
            if (mapElem && $(mapElem).is(":visible")) {
                var map = getMapObject(mapElem, "map");
                if (map) {
                    google.maps.event.trigger(map, 'resize');
                    if (place.geometry.location) {
                        map.setCenter(place.geometry.location);
                        var addressMarker = getMapObject(mapElem, "autocomplete-marker");
                        if (addressMarker) {
                            addressMarker.setPosition(place.geometry.location);
                            addressMarker.setMap(map);
                        }
                    }
                    else if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    }
                }
            }
            var triggerResult = { location: convertPlace(place.address_components, place.types, place.formatted_address, place.geometry && place.geometry.location), result: place };
            console.log("triggerResults: ", triggerResult)
            //$(inputElem).data("validated-place", $(inputElem).val()).trigger("mcd:autocomplete", triggerResult);
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            var address = place.formatted_address;

            var path = `https://www.mycommunitydiary.com.au/SearchRegion?lat=${lat}&lng=${lng}&address=`
            console.log(path)
            const res = await axios.post(path)
            console.log('res: ', res.data)
            window.location.href = 'https://www.mycommunitydiary.com.au/' + res.data
        });
        // $(inputElem).on("mcd:blur", function () {
        //     var value = $(this).data("validated-place");
        //     if (value && value !== $(this).val()) {
        //         $(this).data("validated-place", "").trigger("mcd:autocomplete", {});
        //     }
        // });
    }
}

function getMapObject(elem, type) {
    console.log(elem)
    //var id = $(elem).attr("id");
    var id = document.querySelector(elem).id
    if (id) {
        return mapObjects[id + "/" + type];
    }
    return undefined;
}

function setMapObject(elem, type, obj) {
    var id = document.querySelector(elem).id
    if (id) {
        mapObjects[id + "/" + type] = obj;
    }
}

function convertPlace(addressComponents, types, formattedAddress, location) {
    var suburb = '';
    var num = '';
    var route = '';
    var addr = '';
    var state = '';
    var postcode = '';
    var country = '';
    var premise = '';
    var subpremise = '';
    var establishment = '';
    for (var i = 0; i < addressComponents.length; i++) {
        var comp = addressComponents[i];
        if (comp.types.indexOf("premise", 0) !== -1)
            premise = comp.long_name;
        else if (comp.types.indexOf("subpremise", 0) !== -1)
            subpremise = comp.long_name;
        else if (comp.types.indexOf("establishment", 0) !== -1)
            establishment = comp.long_name;
        else if (comp.types.indexOf("street_address", 0) !== -1)
            addr = comp.long_name;
        else if (comp.types.indexOf("street_number", 0) !== -1)
            num = comp.long_name;
        else if (comp.types.indexOf("route", 0) !== -1)
            route = comp.long_name;
        else if (comp.types.indexOf("locality", 0) !== -1)
            suburb = comp.long_name;
        else if (comp.types.indexOf("administrative_area_level_1", 0) !== -1)
            state = comp.short_name;
        else if (comp.types.indexOf("postal_code", 0) !== -1)
            postcode = comp.short_name;
        else if (comp.types.indexOf("country", 0) !== -1)
            country = comp.long_name;
    }
    if (addr.length === 0) {
        addr = (num + " " + route).trim();
    }
    // Look for text like Brunswick St & McLachlan St, Fortitude Valley QLD 4006, Australia
    if (types.indexOf("intersection", 0) !== -1) {
        var ampersand = formattedAddress.indexOf("&", 0);
        var comma = formattedAddress.indexOf(",", 0);
        if (ampersand > 0 && comma > ampersand) {
            addr = "Cnr of " + (formattedAddress.substring(0, comma)).trim();
        }
    }
    if (addr.length > 0 || suburb.length > 0) {
        var result = {
            building: (subpremise + " " + premise + " " + establishment).trim(),
            address: addr,
            suburb: suburb,
            postcode: postcode,
            state: state,
            country: country,
            latLng: location
        };
        if (location) {
            result.lat = location.lat();
            result.lng = location.lng();
        }
        return result;
    }
    return null;
}

const searchRegion = async (lat, lng) => {
    //https://www.mycommunitydiary.com.au/SearchRegion?lat=-27.5738417&lng=153.0838714&address=
    var url = `https://www.mycommunitydiary.com.au/SearchRegion?lat=${lat}&lng=${lng}&address=`
    console.log("url: ", url)
    const res = await axios.post(url)
    console.log('res: ', res)

    console.log(res.data)
    window.location.href = 'https://www.mycommunitydiary.com.au/' + res.data

}