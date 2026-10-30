(function($) {
    $(document).ready(function() {

            
            /* Show/hide posts widget autoplay option */
            $('body').on('change', '.vce-post-widget-style', function(e){
               if( $(this).val() == 'vce-post-slider'){
                    $(this).closest('.widget-inside').find('.vce-autoplay-opt').show();
               } else {
                    $(this).closest('.widget-inside').find('.vce-autoplay-opt').hide();
               }
               
            });

    });

})(jQuery);