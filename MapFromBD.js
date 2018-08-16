ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
            center: [30.313462, 59.939017],
            zoom: 15
        }),
        deliveryPoint = new ymaps.GeoObject({
            geometry: {type: 'Point'},
            properties: {iconCaption: 'Point'}
        }, {
            preset: 'islands#blackDotIconWithCaption',
            draggable: true,
            iconCaptionMaxWidth: '215'
        });
    
    myMap.controls.add('geolocationControl');     
    
   // myMap.geoObjects.add(deliveryPoint);
    

    function onZonesLoad(json) {
        // ��������� �������� �� �����.
        polygon = new ymaps.Polygon(json.coordinates);
        var deliveryZones = ymaps.geoQuery(polygon).addToMap(myMap);
        
        // �������� ��������� ����� ���������� ������ �������� ��������
        myMap.controls.get('geolocationControl').events.add('locationchange', function (e) {   
            highlightResult(e.get('geoObjects').get(0));
        });

        function highlightResult(obj) {
            // ���� ����������
            var coords = obj.geometry.getCoordinates(),
         
            // �������. � ������� ������� ���� �����
                ispolygon = deliveryZones.searchContaining(coords).get(0);
                deliveryPoint.geometry.setCoordinates(coords);
           //ispolygon=coords.searchInside(polygon);
           
            if (ispolygon) {
                // ���������� ����� � ���������� ���������� � ������������� �� � ���� ��������.
              // deliveryPoint.geometry.setCoordinates([30.313462, 59.939017]);
             myMap.geoObjects.add(new ymaps.Placemark([30.313462, 59.939017], {
            balloonContent: '<strong>Point is inside in the Polygon!</strong>'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        }));	 
               
                if (typeof(obj.getThoroughfare) === 'function') {
                    setData(obj);
                } else {
        			//������ ��������� ��� ����������� �����
                    ymaps.geocode(coords, {results: 1}).then(function (res) {
                        var obj = res.geoObjects.get(0);
                        setData(obj);
                    });
                }
            } else {
                // ���� ���������� ���������� �� �������� � �������, �� ������� ������� ��������, ��������, ������, ���� �� �� �������� �� � ���� ������� 
                deliveryZones.setOptions('fillOpacity', 0.1);
                // ���������� ����� �� ���������� �����������.
                deliveryPoint.geometry.setCoordinates(coords);
            }  
            
        }
         
    }
    
    
    $.ajax({
        url: 'GetPolygonsFromBD.php',
        dataType: 'json',
        success: onZonesLoad
    });
                
}