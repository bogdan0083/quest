$(document).ready(function() {

    // триггер мобильного меню:

    $('.nav-trigger').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        // переключаем состояние переключателя
        $(this).toggleClass('active');


        // показываем меню и оверлей у страницы
        $('.mobile-menu').toggleClass('active');
        $('.page-wrapper').toggleClass('active');


        // Добавляем событие для .page-wrapper
        $('.page-wrapper').click(function(e) {
            $('.mobile-menu').removeClass('active');
            $('.nav-trigger').removeClass('active');

            // и удаляем его при клике на оверлей.
            $(this).removeClass('active').off();
        });
    });



    // стрелка "Вверх" на мобильных
    $('.js-balloon-arrow').on('click', function(e) {
        e.preventDefault();

        $('body, html').animate({
            'scrollTop': 0
        });

    });


    // Показываем шарик со стрелкой Вверх только на мобильных
    if ($(window).width() < 880) {

        // Изначальное состояние стрелки
        var arrowUpIsShown = null;

        // Событие с коллбеком onScroll
        $(window).on('scroll', onScroll);

        function onScroll(e) {

            // Если скролл больше 200 пикселей - показываем стрелку
            if ($(window).scrollTop() > 200 && !arrowUpIsShown) {

                arrowUpIsShown = true;

                $('.js-balloon-arrow').fadeIn();

            } else if ($(window).scrollTop() < 200 && arrowUpIsShown) { // Иначе - скрываем

                arrowUpIsShown = false;

                $('.js-balloon-arrow').fadeOut();
            }
        }
    }



    // fancybox для модальных окон.
    $('.fancybox-modal').fancybox({
        closeBtn: false,
        fitToView: false,
        scrolling: 'visible',
        padding: 0,
        openEffect: 'elastic'
    });


    // fancybox для фотографий
    $('.fancybox').fancybox();


     var initRopemanTop;

    // Параллакс анимации человечков при скролле.    
    if ($('.js-ropeman').length && $(window).width() > 880) {

        initRopemanTop = $('.js-ropeman').position().top;
        
        $(window).on('scroll', parallaxRopeman);
    }

    // Параллакс анимации человечков при скролле.
    if ($('.js-balloonman').length && $(window).width() > 880) {

        parallaxBalloonman();

        $(window).on('scroll', parallaxBalloonman);
    }

    var bottomIsReached = false;

    // функция-callback для параллакса
    function parallaxBalloonman(e) {

        var wScroll = $(window).scrollTop();

        var wHeight = $(window).height();

        var dHeight = $(document).height();


        $('.js-balloonman').css('transform', 'translateY(-' + wScroll * 0.4 + 'px)');

        if ($('.js-balloonman').hasClass('balloonman-main')) {
            return; }
        // Проверяем, если доскролили до конца
        if (reachedBottom(wScroll, wHeight, dHeight) && bottomIsReached) {

            $(window).off();

            var $balloonMan = $('.js-balloonman:not(".balloonman-main")');

            $balloonMan.addClass('js-free').css('transform', 'translateY(-6000px)');

            setInterval(function() {

                $balloonMan.removeClass('js-free').css({
                    'transform': 'none',
                    'top': '120%'
                });
                $balloonMan.toggleClass('balloonman-left');

                setTimeout(function() {
                    $balloonMan.addClass('js-free').css('transform', 'translateY(-6000px)');
                }, 100)
            }, 20000);
        }
    }

    // функция-callback для параллакса
    function parallaxRopeman(e) {
        e.preventDefault();

        $('.js-ropeman').css('top', initRopemanTop + ($(window).scrollTop() * 0.35) + 'px');
    }


    // Функция для проверки скролла. Если мы в самом низу страницы то возвращает true, иначе false
    // ----------------------------------------

    function reachedBottom(wScroll, wHeight, dHeight) {

        if (wScroll + wHeight == dHeight) {

            bottomIsReached = true;

            return true;
        } else {
            return false;
        }
    }

    // Селект
    $('.field-select').selectmenu();

    // Календарь
    $('.field-date').datepicker();

    // Выбор времени
    $('.field-time').datepicker({
        onlyTimepicker: true,
        timepicker: true
    });


    // Кнопка для фокуса по инпуту. Применяется для календаря, времени и выбора файла
    $('.js-field-trigger').click(function(e) {

        e.preventDefault();

        $(this).parent().find('input').trigger('click');
    });

    // бегущий человечек на главной

    if ($('.js-runner').length) {

        launchRunner();

        $(window).on('scroll', launchRunner);
    }

    function launchRunner(e) {
        if ($(window).scrollTop() + $(window).height() >= $('.last-quests-bottom').offset().top) {
            $('.js-runner').addClass('js-runner-active');
        }
    }
    // Делаем активным последнего человечка на ховер

    $('.js-btn-join').hover(function() {

        $('.team-count .i-man-inactive').eq(0).addClass('active');

    }, function() {

        $('.team-count .i-man-inactive').eq(0).removeClass('active');

    });

    //Редактируемая таблица

    $('.js-edit-trigger').editableRow({

        // Если toggable: false, то ряд не переключается, но данные все равно отправляются в onClose
        toggable: true,

        // Какой класс добавлять для кнопки при переключении.
        triggerToggleClass: 'btn-blue',

        // Наша функция-событие. Срабатывает когда мы закрываем редактирование. 

        // rowArray - это массив с данными обо всех инпутах в ряду. 
        // id - это айди кнопки (триггера), которая вызывает редактирование.
        // Подробнее - в консоли
        onClose: function(rowArray, id) {
            console.log(rowArray);
            console.log(id);
        }
    });
});
