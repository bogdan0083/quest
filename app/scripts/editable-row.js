(function($, window) {
    'use strict';

    // Наша функция конструктор. Сердце нашего мини-плагина!
    var EditableRow = function(el, options) {

        // передаем контекст переменной _  и в будущем используем 
        // только эту переменную в качестве контекста конструктора
        var _ = this;

        // Стандартные значения в настройках плагина. 
        _.DEFAULTS = {
            toggable: true,
            container: 'tr',
            inputWrapperClass: '.js-field-wrap',
            isOpen: false,
            triggerToggleClass: 'js-trigger-active',
            textOpen: 'сохранить',
            textClosed: 'изменить'
        }

        // Расширяем наш объект опций через $.extend
        _.options = $.extend({}, _.DEFAULTS, options);



        // кнопка-элемент который включает (или выключает) редактирование таблицы
        _.$triggerEl = el;

        // Данные наших рядов. 
        _.rowsData = {};




        _.$containerElem = _.$triggerEl.closest(_.options.container);


        _.currentActiveContainer;

        _.isOpen = _.options.isOpen === true ? true : false;


        // Айди активного ряда в котором происходит редактирование. Присвайвается при клике на триггер
        _.activeId;

        // инициализация плагина
        _.init();

    };

    EditableRow.prototype.init = function() {

        var _ = this;

        // Добавляет id для каждого ряда и состояние (открыт ряд или закрыт)
        _.buildInitData();

        // Вешаем событие на кнопку. 
        _.$triggerEl.on('click', function(e) {

            // Кнопка на которую кликнули (для передачи в качестве параметра)
            var clickedElem = $(this);

            // используем $.proxy для того чтобы передать контекст нашего конструктора, а не контекст jquery элемента
            $.proxy(_.onTriggerClick(e, clickedElem), _);
        });
    }

    EditableRow.prototype.onTriggerClick = function(e, $elem) {

        e.preventDefault();

        var _ = this;

        var rowObj = {};

        _.activeId = $elem.data('edit-id');

        var $activeRowElem = $elem.closest(_.options.container);

        var $inputs = $activeRowElem.find(':input');
        var $inputWrappers = $activeRowElem.find(_.options.inputWrapperClass);

        var $inputCaptions = $activeRowElem.find('[data-for-name]');

        _.buildDataObject($elem, $inputs);

        _.toggleView($inputWrappers, $inputCaptions, $inputs, $elem);

    }

    EditableRow.prototype.buildDataObject = function($elem, $inputs) {
        var _ = this;

        var activeId = _.activeId;

        if (_.rowsData[activeId].isOpen) {

            // Отслеживаем перевод строки.
            var rCRLF = /\r?\n/g;

            // Уникальный id нашей кнопки (триггера)

            var rowArr = $inputs.map(function(i, field) {

                var val = jQuery(this).val();

                var type = field.type;

                if (type === 'button' || type === 'submit') {
                    return null;
                }

                if (jQuery.isArray(val)) {
                    return jQuery.map(val, function(val) {
                        return { name: field.name, value: val.replace(rCRLF, "\r\n") };
                    });
                }

                var text = $(field).text();

                if (type === 'file') {
                	console.log(field.files);
                    return {
                        name: field.name,
                        value: val.replace(rCRLF, "\r\n"),
                        files: field.files
                    };
                } else if (text) {

                    return {
                        name: field.name,
                        value: val.replace(rCRLF, "\r\n"),
                        text: field.selectedOptions[0].innerText
                    };

                } else if ((type === 'radio' || type === 'checkbox')) {

                    if (!field.checked) {
                        return;
                    }

                    return {
                        name: field.name,
                        value: val.replace(rCRLF, "\r\n"),
                        text: field.parentNode.innerText
                    };

                } else {

                    return {
                        name: field.name,
                        value: val.replace(rCRLF, "\r\n"),
                        text: val.replace(rCRLF, "\r\n")
                    };

                }

            }).get();

            _.rowsData[activeId]['rowArray'] = rowArr;

            if (_.options.onClose) {
                _.options.onClose( _.rowsData[activeId]['rowArray'], activeId);
            }

        }
    }




    EditableRow.prototype.buildInitData = function() {

        var _ = this;

        _.$triggerEl.each(function() {
            var id = $(this).data('edit-id');

            _.rowsData[id] = {
                isOpen: _.options.isOpen
            }

        });

    }


    EditableRow.prototype.toggleView = function($inputWrappers, $inputCaptions, $inputs, $elem) {

        var _ = this;
        var activeId = _.activeId;

        $inputWrappers.toggleClass('js-hidden');

        $inputCaptions.toggleClass('js-hidden');

        $elem.toggleClass(_.options.triggerToggleClass);

        // Переключаем текст
        _.toggleTriggerText($elem);


        if (_.rowsData[activeId].isOpen) {

        	var activeRow = _.rowsData[activeId].rowArray;

        	$inputCaptions.each(function(i, item) {

        		$(item).text(activeRow[i].text);

        	});

        }

        _.rowsData[activeId].isOpen = !_.rowsData[activeId].isOpen;
    }

    EditableRow.prototype.toggleTriggerText = function($elem) {

    	var _ = this;

    	var activeId = _.activeId;

        if (_.rowsData[activeId].isOpen) {

            if ($elem.children().length > 0) {
                $elem.find('span').text(_.options.textClosed);
            } else {
                $elem.text(_.options.textClosed);
            }


        } else {

            if ($elem.children().length > 0) {
                $elem.find('span').text(_.options.textOpen);
            } else {
                $elem.text(_.options.textOpen);
            }
        }

    }

    // jquery функция.
    $.fn.editableRow = function() {

        var el = $(this),
            opts = arguments[0],
            _ = this;

        if (opts)
            _.editableRow = new EditableRow(el, opts);
        else
            _.editableRow = new EditableRow(el);

        return _;
    };

})(jQuery, window);
