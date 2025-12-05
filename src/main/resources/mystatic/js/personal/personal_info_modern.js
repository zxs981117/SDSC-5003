$(function() {
    initAccordion();
    initFormValidation();
    initCompatibility();
});

function initAccordion() {
    $('.section-header').click(function() {
        const $header = $(this);
        const $section = $header.closest('.info-section');
        const $content = $section.find('.info_content');
        
        $('.info_content').not($content).slideUp(300);
        $('.section-header').not($header).removeClass('active');
        
        if ($content.is(':visible')) {
            $content.slideUp(300);
            $header.removeClass('active');
        } else {
            $content.slideDown(300);
            $header.addClass('active');
        }
    });
}

function initFormValidation() {
    $('input[type="text"], input[type="email"]').focus(function() {
        $(this).siblings('.reqiure_enter').removeClass('show');
    });
    
    $('input[type="text"], input[type="email"]').blur(function() {
        const value = $(this).val().trim();
        const $error = $(this).siblings('.reqiure_enter');
        
        if (!value) {
            $error.addClass('show');
        } else {
            $error.removeClass('show');
        }
    });
    
    $('input[type="email"]').blur(function() {
        const email = $(this).val().trim();
        const $error = $(this).siblings('.reqiure_enter');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            $error.text('请输入正确的邮箱格式').addClass('show');
        } else if (!email) {
            $error.text('必须填写此字段').addClass('show');
        } else {
            $error.removeClass('show');
        }
    });
}

function initCompatibility() {
    $('.update_button').off('click').on('click', function() {
        var token = $('.token').val();
        var $formGroup = $(this).siblings(".form-group");
        var $input = $formGroup.find("input");
        var type = $input.attr("type");
        var which_update = $input.attr("class");
        var my_this = $(this);
        
        if (type == "radio") {
            var value = $formGroup.find("input:checked").val();
            var arr = "gender=" + value + "&" + "token=" + token + "";
            $.ajax({
                url: '/certification.do',
                type: 'post',
                dataType: 'JSON',
                data: arr,
                success: function(data) {
                    var result = data.result;
                    if (result === 0) {
                        alert('更新失败，请检测信息格式');
                    } else if (result === 1) {
                        alert('更新成功');
                        var genderText = value == "1" ? "男" : "女";
                        my_this.closest('.info-section').find('.section-header h3 span').html(genderText);
                    }
                }
            });
        } else {
            var val = $input.val();
            if (val == undefined || val == '') {
                $formGroup.find(".reqiure_enter").addClass('show');
            } else {
                var value = $input.val();
                var arr = which_update + "=" + value + "&" + "token=" + token + "";
                $.ajax({
                    url: '/certification.do',
                    type: 'post',
                    dataType: 'JSON',
                    data: arr,
                    success: function(data) {
                        var result = data.result;
                        if (result === 0) {
                            alert('更新失败，请检测信息格式');
                        } else if (result === 1) {
                            alert('更新成功');
                            updateText(value);
                        }
                        if (which_update === 'userName') {
                            $('.user_name_a').text(value);
                        }
                    }
                });
            }
        }
        
        function updateText(value) {
            my_this.closest('.info-section').find('.section-header h3 span').html(value);
        }
    });
    
    $('.form-group input').bind("input propertychange change", function() {
        var val = $(this).val();
        if (val != undefined && val != '') {
            $(this).siblings(".reqiure_enter").removeClass('show');
        }
    });
}
