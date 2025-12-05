$(function () {
    $('body').click(function (e) {
        if (e.clientX > 150 || e.clientY > 300) {
            if ($('.short_nav_show').is(":visible")) {
                $('.short_nav_show').fadeOut(300);
            }
            if ($('.personal_nav').is(":visible")) {
                $('.personal_nav').fadeOut(300);
            }
        }
    });


    $('.search_icon').click(function () {

    });
    $('.short_nav').click(function () {
        if ($('.short_nav_show').is(":visible")) {
            $('.short_nav_show').fadeOut(300);
        } else {
            $('.short_nav_show').fadeIn(300);
        }
    });
    $('.user_name_a').mouseenter(function () {
        $('.personal_nav').fadeIn(300);
    });
    $('.personal_nav').mouseleave(function () {
        $(this).fadeOut(300);
    });
    $('.search_icon').click(function () {
        var name = $('.nav_search_input').val();
        window.location.href = '/findShopByName.do?name=' + name;
    });
});
jQuery(document).ready(function ($) {
    // if (window.history && window.history.pushState) {
    //     $(window).on('popstate', function () {
    //         var hashLocation = location.hash;
    //         var hashSplit = hashLocation.split("#!/");
    //         var hashName = hashSplit[1];
    //         if (hashName !== '') {
    //             var hash = window.location.hash;
    //             if (hash === '') {
    //                 // alert("Back button isn't supported. You are leaving this application on next clicking the back button");
    //                 window.history.pushState('forward', null,'./?WSKandXYF=后退不了了吧，我故意设置的');
    //             }
    //         }
    //     });
    //     window.history.pushState('forward', '/?wsk','./?WSKandXYF='+new Date().getTime());
    // }
    //监听关闭事件
    window.onbeforeunload =(function () {
        window.location.href='/logout.do';
    });
    var host = window.location.host;
    var me = new Date().getTime();
    var websocket = new WebSocket("ws://" + host + "/sockjs/webSocketIMServer");
    var phone = $('#user_name_a').attr('value');
    if (phone !== 'wsk') {
        websocket.onopen = function () {
            console.log("websocket连接上");
            websocket.send(phone+","+me+",start");
        };
        websocket.onmessage = function (evnt) {
            // console.log(evnt.data);
            var result = evnt.data;
            if (result == "error"){
                window.location.href='/logout.do';
                alert("该账号在其他地方登录了，请检查是否为本人操作，防止密码丢失！！！");
                return;
            }
            setTimeout(function () {
                messageHandle();
            }, 2000);
        };
        websocket.onerror = function () {
            console.log("websocket错误");
        };
        websocket.onclose = function () {
            console.log("websocket关闭");
        };
        function messageHandle() {
            // alert(phone);
            websocket.send(phone+","+me+",send");
        };
    }
});
