(function($) {
    $(document).ready(function() {

        /* Image opts selection */
        $('body').on('click', 'img.vce-img-select', function(e) {
            e.preventDefault();
            $(this).closest('ul').find('img.vce-img-select').removeClass('selected');
            $(this).addClass('selected');
            $(this).closest('ul').find('input').removeAttr('checked');
            $(this).closest('li').find('input').attr('checked', 'checked');

            if ($(this).closest('ul').hasClass('next-hide')) {
                var v = $(this).closest('li').find('input:checked').val();

                if (v == 'inherit' || v == 0) {
                    $(this).closest('.vce-opt').next().fadeOut(400);
                } else {
                    $(this).closest('.vce-opt').next().fadeIn(400);
                }
            }
        });

        tagBox.init();


        /* Dynamicaly apply select value */
        $('body').on('change', '.vce-opt-select', function(e) {
            //e.preventDefault();
            var sel = $(this).val();
            $(this).find('option').removeAttr('selected');
            $(this).find('option[value=' + sel + ']').attr('selected', 'selected');
        });

        /* Module form tabs */
        $('body').on('click', '.vce-opt-tabs a', function(e) {
            e.preventDefault();
            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');
            $(this).closest('.vce-module-form').find('.vce-tab').hide();
            $(this).closest('.vce-module-form').find('.vce-tab').eq($(this).index()).show();

        });

        var vce_current_module;
        var vce_module_type;


        /* Add new module */
        $('body').on('click', '.vce-add-module', function(e) {
            e.preventDefault();
            vce_module_type = $(this).attr('data-type');
            var $modal = $($.parseHTML('<div class="vce-module-form">' + $('#vce-module-clone .' + vce_module_type + ' .vce-module-form').html() + '</div>'));
            vce_dialog($modal, 'Add New Module', 'vce-save-module');

            /* Make some options sortable */
            $(".vce-opt-content .sortable").sortable({
                revert: false,
                cursor: "move",
                placeholder: 'vce-fields-placeholder'
            });

        });

        /* Edit module */
        $('body').on('click', '.vce-edit-module', function(e) {
            e.preventDefault();
            vce_current_module = parseInt($(this).closest('.vce-module').attr('data-module'));
            var $modal = $(this).closest('.vce-module').find('.vce-module-form').clone();

            vce_dialog($modal, 'Edit Module', 'vce-save-module');

            /* Make some options sortable */
            $(".vce-opt-content .sortable").sortable({
                revert: false,
                cursor: "move",
                placeholder: 'vce-fields-placeholder'
            });

        });

        /* Remove module */
        $('body').on('click', '.vce-remove-module', function(e) {
            e.preventDefault();
            var remove = vce_confirm();
            if (remove) {
                $(this).closest('.vce-module').fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });

        /* Deactivate/Activate module */
        $('body').on('click', '.vce-deactivate-module', function(e) {
            e.preventDefault();
            var _self = $(this);
            var parent_el = _self.closest('.vce-module');
            var h_data = parent_el.find('.vce-module-deactivate').val();

            _self.find('span').toggleClass('vce-hidden');

            if (h_data == 1) {
                parent_el.find('.vce-module-deactivate').val('0');
                parent_el.addClass('vce-module-disabled');
            } else {
                parent_el.find('.vce-module-deactivate').val('1');
                parent_el.removeClass('vce-module-disabled');
            }

        });

        /* Save module */

        $('body').on('click', 'button.vce-save-module', function(e) {

            e.preventDefault();

            var $vce_form = $(this).closest('.wp-dialog').find('.vce-module-form').clone();

            /* Nah, jQuery clone bug, clone text area manually */
            var txt_content = $(this).closest('.wp-dialog').find('.vce-module-form').find("textarea").first().val();
            if (txt_content !== undefined) {
                $vce_form.find("textarea").first().val(txt_content);
            }

            if ($vce_form.hasClass('edit')) {
                $vce_form = vce_fill_form_fields($vce_form);
                var $module = $('.vce-module-' + vce_current_module);
                $module.find('.vce-module-form').html($vce_form.html());
                $module.find('.vce-module-title').text($vce_form.find('.mod-title').val());
            } else {
                var count = $('.vce-modules-count').attr('data-count');
                $vce_form = vce_fill_form_fields($vce_form, 'vce[modules][' + count + ']');
                $('.vce-modules').append($('#vce-module-clone .' + vce_module_type).html());
                var $new_module = $('.vce-modules .vce-module').last();
                $new_module.addClass('vce-module-' + parseInt(count)).attr('data-module', parseInt(count)).find('.vce-module-form').addClass('edit').html($vce_form.html());
                $new_module.find('.vce-module-title').text($vce_form.find('.mod-title').val());
                $('.vce-modules-count').attr('data-count', parseInt(count) + 1);
            }

        });

        /* Open our dialog modal */
        function vce_dialog(obj, title, action) {

            obj.dialog({
                'dialogClass': 'wp-dialog',
                'appendTo': false,
                'modal': true,
                'autoOpen': false,
                'closeOnEscape': true,
                'draggable': false,
                'resizable': false,
                'width': 800,
                'height': $(window).height() - 60,
                'title': title,
                'close': function(event, ui) {
                    $('body').removeClass('modal-open');
                },
                'buttons': [{
                    'text': "Save",
                    'class': 'button-primary ' + action,
                    'click': function() {
                        $(this).dialog('close');
                    }
                }]
            });

            obj.dialog('open');

            $('body').addClass('modal-open');
        }


        /* Fill form fields dynamically */
        function vce_fill_form_fields($obj, name) {

            $obj.find('.vce-count-me').each(function(index) {


                if (name !== undefined && !$(this).is('option')) {
                    $(this).attr('name', name + $(this).attr('name'));
                }

                if ($(this).is('textarea')) {
                    $(this).html($(this).val());
                }


                if (!$(this).is('select')) {
                    $(this).attr('value', $(this).val());
                }



                if ($(this).is(":checked")) {
                    $(this).attr('checked', 'checked');
                } else {
                    $(this).removeAttr('checked');
                }

            });

            return $obj;
        }

        function vce_confirm() {
            var ret_val = confirm("Are you sure?");
            return ret_val;
        }


        /* Make modules sortable */
        $(".vce-modules").sortable({
            revert: false,
            cursor: "move",
            placeholder: "vce-module-drop"
        });

        vce_template_metaboxes();

        $('#page_template').change(function(e) {
            vce_template_metaboxes(true);
        });


        /* Metabox switch - do not show every metabox for every template */
        function vce_template_metaboxes(scroll_to) {

            if (scroll_to === undefined) {
                scroll_to = false;
            }
            var template = $('select#page_template').val();
            var target = '';
            if (template == 'template-modules.php') {
                $('#vce_hp_fa').fadeIn(300);
                $('#vce_hp_modules').fadeIn(300);
                $('#vce_hp_content').fadeIn(300);
                if (scroll_to) {
                    target = $('#vce_hp_modules').attr('id');
                    $('html, body').stop().animate({
                        'scrollTop': $('#' + target).offset().top
                    }, 900, 'swing', function() {
                        window.location.hash = target;
                    });
                }
            } else {
                $('#vce_hp_fa').fadeOut(300);
                $('#vce_hp_modules').fadeOut(300);
                $('#vce_hp_content').fadeOut(300);
            }

            if (template == 'template-authors.php') {
                $('#vce_authors').fadeIn(300);
                if (scroll_to) {
                    target = $('#vce_authors').attr('id');
                    $('html, body').stop().animate({
                        'scrollTop': $('#' + target).offset().top
                    }, 900, 'swing', function() {
                        window.location.hash = target;
                    });
                }
            } else {
                $('#vce_authors').fadeOut(300);
            }

        }

        /* Show hide actions */

        $("body").on("click", ".vce-action-pick", function(e) {
            var class_prefix = $(this).val();
            $(this).closest('.vce-tab').find('.hideable').hide();
            $(this).closest('.vce-tab').find('.vce-' + class_prefix + '-wrap').fadeIn(300);
        });



    });



})(jQuery);