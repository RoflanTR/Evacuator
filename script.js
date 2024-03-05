ymaps.ready(init);
var len = document.querySelector("#len");
var cost = document.querySelector("#price");
var warn = document.querySelector("#warning");
function init() {
    // Стоимость за километр.
    var DELIVERY_TARIFF = 20,
    // Минимальная стоимость.
        MINIMUM_COST = 500,
        myMap = new ymaps.Map('map', {
            center: [57.1526882, 65.547233],
            zoom: 13,
            controls: []
        }),
    // Создадим панель маршрутизации.
        routePanelControl = new ymaps.control.RoutePanel({
            options: {
                // Добавим заголовок панели.
                showHeader: true,
                title: 'Расчёт доставки',
                autofocus: false
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: 'small',
                float: 'none',
                position: {
                    bottom: 145,
                    right: 10
                }
            }
        });
    // Пользователь сможет построить только автомобильный маршрут.
    routePanelControl.routePanel.options.set({
        types: {auto: true}
    });

    // // Если вы хотите задать неизменяемую точку "откуда", раскомментируйте код ниже.
    // routePanelControl.routePanel.state.set({
    //     fromEnabled: false,
    //     from: 'Тюмень, Киевская 50'
    //  });

    myMap.controls.add(routePanelControl).add(zoomControl);

    // Получим ссылку на маршрут.
    routePanelControl.routePanel.getRouteAsync().then(function (route) {

        // Зададим максимально допустимое число маршрутов, возвращаемых мультимаршрутизатором.
        route.model.setParams({results: 1}, true);

        // Повесим обработчик на событие построения маршрута.
        route.model.events.add('requestsuccess', function () {

            var activeRoute = route.getActiveRoute();
            if (activeRoute) {
                // Получим протяженность маршрута.
                var length = route.getActiveRoute().properties.get("distance"),
                
                // Вычислим стоимость доставки.
                    price = calculate(Math.round(length.value / 1000)),
                    
                // Создадим макет содержимого балуна маршрута.
                    balloonContentLayout = ymaps.templateLayoutFactory.createClass(
                        '<span>Расстояние: ' + length.text + '.</span><br/>' +
                        '<span style="font-weight: bold; font-style: italic">Стоимость доставки: ' + price + ' р.</span>');
                       
                        warning(length.text,price,length.value);
                //Таблица с расчетами на карте

                // // Зададим этот макет для содержимого балуна.
                // route.options.set('routeBalloonContentLayout', balloonContentLayout);
                // // Откроем балун.
                // activeRoute.balloon.open();
            }
        });

    });
    // Функция, вычисляющая стоимость доставки.
    function calculate(routeLength) {
        return Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
    }
    function warning(text,price,length)
    {
        if(length>20000)
        {
            warn.style.display="block";
            len.style.display="none";
            cost.style.display="none";
        }
        else{
            len.style.display="block";
            cost.style.display="block";
            warn.style.display="none";
            len.textContent = "Расстояние: "+ text;
            cost.textContent = "Цена: "+ price+"Р";
        }
    }
}

/*---------- */
var moto = document.querySelector('.moto-transport');
var car = document.querySelector('.auto-transport');
var selectTransport = document.querySelector('.select-transport');
document.querySelector(".manipulator").addEventListener('click',()=>{
    moto.style.display='none';
    if(car.style.display=='none'){
        car.style.display='block';
    }
    if(selectTransport.style.display=='none'){
        selectTransport.style.display='block'
    }
})
document.querySelector(".motoevacuator").addEventListener('click',()=>{
    car.style.display='none';
    if(moto.style.display=='none'){
        moto.style.display='block';
    }
    if(selectTransport.style.display=='none'){
        selectTransport.style.display='block'
    }
})
document.querySelector(".cargo").addEventListener('click',()=>{
    selectTransport.style.display='none';
})