$(function () {
    var from_which = 0;

    function validatePhone(phone) {
        if (!phone || phone.trim() === '') {
            return {valid: false, message: '请输入手机号码'};
        }
        var phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone.trim())) {
            return {valid: false, message: '请输入正确的11位手机号码（支持13x-19x号段）'};
        }
        return {valid: true, message: ''};
    }

    var panels = ['.login', '.register_page', '.enter_password', '.forget_password'];
    function showPanel(selector) {
        $(panels.join(',')).hide();
        $(selector).show();
    }

    showPanel('.login');
    $('.enter_password').hide(0);

    $('.flip_to_register').bind('click', function () {
        showPanel('.register_page');
    });
    $('.go_to_forget').bind('click', function () {
        showPanel('.forget_password');
    });

    $('.go_back_login_from_forget').bind('click', function () {
        showPanel('.login');
    });
    $('a.go_back_login').bind('click', function () {
        showPanel('.login');
    });

    $('.go_enter_password_button').bind('click', function () {
        from_which = 1;
        var name = $('.input_nickname').val();
        var phone = $('.register_input_phone').val();
        var code = $('.register_input_vcode').val();
        var token = $('.token').val();
        
        if (!name || name.trim() === '') {
            alert('请输入昵称');
            return;
        }
        
        var phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            alert(phoneValidation.message);
            return;
        }
        
        if (!code || code.trim() === '') {
            alert('请输入验证码');
            return;
        }
        
        $.ajax({
            url: 'checkCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {name: name, phone: phone.trim(), code: code.trim(), token: token},
            success: function (data) {
                var result = data.result;
                if (result === 0) {
                    alert('验证码错误，请重新输入');
                } else if (result === 1) {
                    showPanel('.enter_password');
                    $('.confirm_register_button').html('注册');
                }
            },
            error: function() {
                alert('网络错误，请稍后重试');
            }
        });
    });
    $('.confirm_register_button').click(function () {
        var password = $('.first_enter_password_input').val();
        var password2 = $('.confirm_password_input').val();
        var token = $('.token').val();
        if (password ===''||password2===''){
            alert('请填写信息');
            return;
        }

        if (password !== password2) {
            alert('输入两次的密码不一致');
            return;
        }
        if (from_which === 1) {
            $.ajax({
                url: 'insertUser.do',
                dataType: 'JSON',
                type: 'post',
                data: {password: password, token: token},
                success: function (data) {
                    var result = data.result;
                    if (result === 1) {
                        alert('注册成功！正在跳转...');
                        window.location.href = '/';
                    } else if (result === 0) {
                        alert('注册失败，该手机号可能已被注册，请检查后重试');
                    } else {
                        alert('注册失败，请稍后重试');
                    }
                },
                error: function() {
                    alert('网络错误，请稍后重试');
                }
            });
        } else {
            $.ajax({
                url: 'updatePassword.do',
                dataType: 'JSON',
                type: 'post',
                data: {password: password, token: token},
                success: function (data) {
                    var result = data.result;
                    if (result === 1) {
                        alert('密码重置成功！正在跳转...');
                        window.location.href = '/';
                    } else if (result === 0) {
                        alert('密码重置失败，请检查信息后重试');
                    } else {
                        alert('密码重置失败，请稍后重试');
                    }
                },
                error: function() {
                    alert('网络错误，请稍后重试');
                }
            });
        }
    });

    $('.forget_password_button').bind('click', function () {
        from_which = 2;
        var phone = $('.forget_input_phone').val();
        var code = $('.forget_input_vcode').val();
        var token = $('.token').val();
        
        var phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            alert(phoneValidation.message);
            return;
        }
        
        if (!code || code.trim() === '') {
            alert('请输入验证码');
            return;
        }
        
        $.ajax({
            url: 'checkCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {phone: phone.trim(), code: code.trim(), token: token},
            success: function (data) {
                var result = data.result;
                if (result === 0) {
                    alert('验证码错误，请重新输入');
                } else if (result === 1) {
                    showPanel('.enter_password');
                    $('.confirm_register_button').html('重置密码');
                }
            },
            error: function() {
                alert('网络错误，请稍后重试');
            }
        });
    });

    $('.go_back_up').bind('click', function () {
        showPanel('.login');
    });
    $('.login_button').click(function () {
        var login_name = $('.input_username').val();
        var login_password = $('.input_password').val();
        
        var phoneValidation = validatePhone(login_name);
        if (!phoneValidation.valid) {
            alert(phoneValidation.message);
            return;
        }
        
        if (!login_password || login_password.trim() === '') {
            alert('请输入密码');
            return;
        }
        
        $(this).submit();
    });

    $('.get_vcode_button').click(function () {
        var phone = $('.register_input_phone').val();
        var token = $('.token').val();
        
        var phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            alert(phoneValidation.message);
            return;
        }
        
        $.ajax({
            url: 'sendCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {phone: phone.trim(), token: token, action: 'register'},
            success: function (date) {
                var result = date.result;
                if (result == '1') {
                    alert('验证码已发送（本地测试：请输入固定验证码 1479）');
                } else if (result == '0') {
                    alert('手机号格式不正确，请输入11位有效手机号码');
                } else if (result == '-1') {
                    alert('该手机号码已被注册，请使用其他手机号或直接登录');
                } else {
                    alert('发送失败，请稍后重试');
                }
            },
            error: function() {
                alert('网络错误，请稍后重试');
            }
        });
    });
    $('.forget_get_vcode_button').click(function () {
        var phone = $('.forget_input_phone').val();
        var token = $('.token').val();
        
        var phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            alert(phoneValidation.message);
            return;
        }
        
        $.ajax({
            url: 'sendCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {phone: phone.trim(), token: token, action: 'forget'},
            success: function (date) {
                var result = date.result;
                if (result == '1') {
                    alert('验证码已发送（本地测试：请输入固定验证码 1479）');
                } else if (result == '0') {
                    alert('手机号格式不正确，请输入11位有效手机号码');
                } else if (result == '-1') {
                    alert('该手机号未注册，请检查手机号是否正确或先进行注册');
                } else {
                    alert('发送失败，请稍后重试');
                }
            },
            error: function() {
                alert('网络错误，请稍后重试');
            }
        });
    });
})
;
