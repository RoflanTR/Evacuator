/*---------- */
var Price_order = 0;
var price_count = document.querySelector(".price_count");
var moto = document.querySelector('.moto-transport');
var car = document.querySelector('.auto-transport');
var selectTransport = document.querySelector('.select-transport');
var blockPrice = document.querySelector(".price");
document.getElementById("phone").onkeypress = function(e) {
    var chr = String.fromCharCode(e.which);
    if ("1234567890NOABC".indexOf(chr) < 0)
        return false;
};

test();
function test() {
    var price = 0;
    var block = false;
    var manipulator = false;
    var motoevacuator = false;
    var garage = false;
    var parking = false;

    document.querySelector(".manipulator").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        manipulator = true;
        motoevacuator = false;
        if (block) {
            price = 5000;
            price_count.textContent = price;
        }
        if (!block) {
            price = 4000;
            price_count.textContent = price;
        }
        moto.style.display = 'none';
        if (car.style.display == 'none') {
            car.style.display = 'block';
        }
        if (selectTransport.style.display == 'none') {
            selectTransport.style.display = 'block'
        }
    })
    document.querySelector(".motoevacuator").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        manipulator = false;
        motoevacuator = true;
        if (block) {
            price = 5000;
            price_count.textContent = price;
        }
        if (!block) {
            price = 3500;
            price_count.textContent = price;
        }

        car.style.display = 'none';
        if (moto.style.display == 'none') {
            moto.style.display = 'block';
        }
        if (selectTransport.style.display == 'none') {
            selectTransport.style.display = 'block'
        }
    })
    document.querySelector(".cargo").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        price = 8000;
        price_count.textContent = price;
        selectTransport.style.display = 'none';
    })

    document.querySelector(".block_yes").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        block = true;
        if (price >= 8000) {
            price_count.textContent = 8000;
        }
        if (price < 8000) {
            price = 5000;
            price_count.textContent = price;
        }
    })
    document.querySelector(".block_no").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        block = false;
        if (price >= 8000) {
            price_count.textContent = 8000;
        }
        if (price < 8000 && (garage == false && parking == false)) {
            if (manipulator) {
                price = 4000;
                price_count.textContent = price;
            }
            if (motoevacuator) {
                price = 3500;
                price_count.textContent = price;
            }
        }
        if (price < 8000 && (garage == true || parking == true)) {

            price = 5000;
            price_count.textContent = price;
        }
    })
    document.querySelector(".parking").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        parking = true;
        garage = false;
        if (price >= 8000) {
            price_count.textContent = 8000;
        }
        if (price < 8000) {
            price = 5000;
            price_count.textContent = price;
        }
    })
    document.querySelector(".garage").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        parking = false;
        garage = true;
        if (price >= 8000) {
            price_count.textContent = 8000;
        }
        if (price < 8000) {
            price = 5000;
            price_count.textContent = price;
        }
    })
    document.querySelector(".street").addEventListener('click', () => {
        blockPrice.style.display = 'block';
        parking = false;
        garage = false;
        if (price >= 8000) {
            price_count.textContent = 8000;
        }
        if (price < 8000) {
            if (manipulator && block == false) {
                price = 4000;
                price_count.textContent = price;
            }
            if (motoevacuator && block == false) {
                price = 3500;
                price_count.textContent = price;
            }
            if (manipulator && block) {
                price = 5000;
                price_count.textContent = price;
            }
            if (motoevacuator && block) {
                price = 5000;
                price_count.textContent = price;
            }
        }
    })
}




ymaps.ready(init);
var len = document.querySelector("#len");
var cost = document.querySelector(".price_count");
var warn = document.querySelector("#warning");
function init() {
    // Стоимость за километр.
    var DELIVERY_TARIFF = 0,
        // Минимальная стоимость.
        MINIMUM_COST = 3500,
        myMap = new ymaps.Map('map', {
            center: [57.1526882, 65.547233],
            zoom: 11,
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
        types: { auto: true }
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
        route.model.setParams({ results: 1 }, true);

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

                warning(length.text, price, length.value);
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
    function warning(text, price, length) {
        if (length > 20000) {

        }
        else {

        }
    }

}

