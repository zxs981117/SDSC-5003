$(function() {
    initCharacterCount();
    initImagePreview();
    initFormValidation();
});

function initCharacterCount() {
    $('.detail_textarea').on('input', function() {
        const current = $(this).val().length;
        const max = $(this).attr('maxlength');
        $(this).siblings('.char-count').find('.current').text(current);
        
        if (current > max * 0.9) {
            $(this).siblings('.char-count').addClass('warning');
        } else {
            $(this).siblings('.char-count').removeClass('warning');
        }
    });
    
    $('.detail_textarea').trigger('input');
}

function initImagePreview() {
    $('.upload_img_input').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const $preview = $('.show_choose_img');
                $preview.attr('src', e.target.result);
                $preview.addClass('show');
                
                $('.upload-placeholder').hide();
            };
            reader.readAsDataURL(file);
        }
    });
}

function initFormValidation() {
    $('.publish-form').on('submit', function(e) {
        let isValid = true;
        
        $('input[required], textarea[required], select[required]').each(function() {
            const $field = $(this);
            const value = $field.val().trim();
            
            if (!value) {
                isValid = false;
                $field.addClass('error');
                showFieldError($field, '此字段为必填项');
            } else {
                $field.removeClass('error');
                hideFieldError($field);
            }
        });
        
        const price = $('.cost_input').val();
        if (price && (isNaN(price) || parseFloat(price) <= 0)) {
            isValid = false;
            $('.cost_input').addClass('error');
            showFieldError($('.cost_input'), '请输入有效的价格');
        }
        
        const quantity = $('.count_input').val();
        if (quantity && (isNaN(quantity) || parseInt(quantity) <= 0)) {
            isValid = false;
            $('.count_input').addClass('error');
            showFieldError($('.count_input'), '请输入有效的数量');
        }
        
        if (!isValid) {
            e.preventDefault();
            $('.submit-btn').addClass('shake');
            setTimeout(() => $('.submit-btn').removeClass('shake'), 500);
        }
    });
    
    $('input, textarea, select').on('input change', function() {
        $(this).removeClass('error');
        hideFieldError($(this));
    });
}

function showFieldError($field, message) {
    const $error = $field.siblings('.field-error');
    if ($error.length === 0) {
        $field.after(`<div class="field-error">${message}</div>`);
    } else {
        $error.text(message);
    }
}

function hideFieldError($field) {
    $field.siblings('.field-error').remove();
}
