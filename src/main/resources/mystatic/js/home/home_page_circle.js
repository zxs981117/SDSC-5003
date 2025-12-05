// 初始化Swiper
const heroSwiper = new Swiper('.hero-swiper', {
    // 基本配置
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    effect: 'slide',
    speed: 800,
    
    // 导航按钮
    navigation: {
        nextEl: '.hero-swiper .swiper-button-next',
        prevEl: '.hero-swiper .swiper-button-prev',
    },
    
    // 分页器
    pagination: {
        el: '.hero-swiper .swiper-pagination',
        clickable: true,
    },
    
    // 鼠标悬停暂停
    on: {
        init: function() {
            console.log('Swiper initialized successfully');
        }
    }
});

// 鼠标悬停控制
document.querySelector('.hero-swiper').addEventListener('mouseenter', () => {
    heroSwiper.autoplay.stop();
});

document.querySelector('.hero-swiper').addEventListener('mouseleave', () => {
    heroSwiper.autoplay.start();
});

$(function() {
    $('.buy').click(function () {
        var id = $(this).attr('value');
        $.ajax({
            url:'/insertGoodsCar.do',
            dataType:'JSON',
            type:'post',
            data:{id:id},
            success:function (data) {
                var result = data.result;
                if (result == '2'){
                    alert('您还未登录，请先登录！！！');
                } else if (result == '1'){
                    alert('加入购物车成功');
                } else if (result == '0'){
                    alert('加入购物车失败');
                } else {
                    alert('发生了错误，请检测网络');
                }
            }
        })
    });

    // var host = window.location.host;
    // var websocket = new WebSocket("ws://" + host + "/sockjs/webSocketIMServer");
    // var phone = $('#user_name_a').attr('value');
    // if (phone !== 'wsk') {
    //     websocket.onopen = function () {
    //         console.log("websocket连接上");
    //         websocket.send("start");
    //     };
    //     websocket.onmessage = function (evnt) {
    //         // console.log(evnt.data);
    //         var result = evnt.data;
    //         if (result == "error"){
    //             window.location.href='/logout.do';
    //             alert("该账号在其他地方登录了，请检查是否为本人操作，防止密码丢失！！！");
    //             return;
    //         }
    //         setTimeout(function () {
    //             messageHandle();
    //         }, 2000);
    //     };
    //     websocket.onerror = function () {
    //         console.log("websocket错误");
    //     };
    //     websocket.onclose = function () {
    //         console.log("websocket关闭");
    //     };
    //     function messageHandle() {
    //         // alert(phone);
    //         websocket.send(phone);
    //     };
    // }
});
