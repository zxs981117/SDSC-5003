var currentProducts = [];
var originalProducts = [];
var currentKeyword = '';

$(function () {
    insertShopCar();
    var type_list = getTypeList();
    
    // 从初始 DOM 构建产品数据（用于排序）
    initCurrentProductsFromDom();

    // 记录当前搜索关键词，用于高亮
    currentKeyword = $.trim($('.search-form input[name="name"]').val() || '');
    applyKeywordHighlight();

    // 新版本的分类交互
    initModernMallInteractions();
    
    // 为页面初始加载的商品标题绑定点击事件
    $('.product-title').click(function() {
        var productId = $(this).data('product-id');
        if (productId) {
            window.location.href = '/selectById.do?id=' + productId;
        }
    });
    $(window).scroll(function () {
        var temp = $(this).scrollTop();
        if (temp > 100) {
            $('.my_type_div').css({"margin-top": "8%"});
            $('.particular_type_div').css({"margin-top": "8%"});
        } else {
            $('.my_type_div').css({"margin-top": "15%"});
            $('.particular_type_div').css({"margin-top": "15%"});
        }
    });
    $('.my_type_div ul li').hover(function () {
        var temp_class = $(this).attr("class");
        if (temp_class == 'type_1') {
            addList(0);
        } else if (temp_class == 'type_2') {
            addList(1);
        } else if (temp_class == 'type_3') {
            addList(2);
        } else if (temp_class == 'type_4') {
            addList(3);
        } else if (temp_class == 'type_5') {
            addList(4);
        } else if (temp_class == 'type_6') {
            addList(5);
        }
        function addList(id) {
            var which = type_list[id];
            var my_string = "";
            for (j = 0; j < which.length; j++) {
                var type_i = which[j];
                var arr = type_i.content;
                var a_list = "";
                for (i = 0; i < arr.length; i++) {
                    a_list += "<a id = '" + arr[i].id + "' class='shop_sort'>" + arr[i].name + "</a>";
                }
                my_string += "<div class='one_part'><div class='type_title_div'>" +
                    "<span class='type_border_span'>1</span><h3>" + type_i.name + "</h3></div><div " +
                    "class='type_goods_list'>" + a_list + "</div></div>";
            }
            $('.particular_type_div').html(my_string);
            //  点击事件
            $('.type_goods_list a.shop_sort').click(function () {
                var wsk = $(this).attr('id');
                var $all_product = $('.all_product');
                $.ajax({
                    url: 'selectBySort.do',
                    type: 'post',
                    dataType: 'JSON',
                    data: {sort: wsk},
                    success: function (data) {
                        $all_product.html('');
                        if (data.length === 0) {
                            $all_product.append("<div class='product_content_div'>" +
                                "<figure class='detail_product'>" +
                                "<input type='hidden' value= ''/>" +
                                "<img src='' title='暂时没有该分类的商品' />" +
                                "<span class='detail_product_name'></span><br/>" +
                                "<span class='detail_product_cost'></span><br/>" +
                                "<span class='detail_buy product_1'>加入购物车</span>" +
                                "</figure>" +
                                "</div>");
                        }
                        for (var i = 0; i < data.length; i++) {
                            $all_product.append("<div class='product_content_div'>" +
                                "<div class='detail_product'>" +
                                "<input type='hidden' value=" + data[i].id + " '/>" +
                                "<div class='product_img_div'><img class='show_img' src='" + data[i].image + "' title=" + data.name + "'/></div>" +
                                "<p class='show_tip'>"+data[i].remark+"</p>"+
                                "<span class='detail_product_name' value='"+data[i].id+"'>" + data[i].name + "</span><br/>" +
                                "<span class='detail_product_cost'>￥" + data[i].price + "</span><br/>" +
                                "<span class='detail_buy product_1' value='"+data[i].id+"'>加入购物车</span>" +
                                "</div>" +
                                "</div>");
                        }
                        //进入查看商品的详情,通过id
                        $('.detail_product_name').click(function () {
                            var id = $(this).attr('value');
                            window.location.href='/selectById.do?id='+id;
                        });
                        insertShopCar();
                    }
                });
                // alert(wsk);

            })
        }

        $('.particular_type_div').show(0);
    });
    $('header').click(function () {
        hideParticular();
    });
    //new
    bindClick();
    //  直接点击页数
    function bindClick() {
        $('.pagination_div ul li').click(function () {
            var cur = $(".pagination_div ul li.current_page").children("a").html();
            $(".pagination_div ul li.current_page").removeClass("current_page");
            $(this).addClass("current_page");
            //  点击的页数
            var which_click = $(this).children("a").html();
            //  在if里面处理
            if (cur !== which_click) {
                selectByCounts(which_click);
            }
        });
    }

    //  上一页
    $('.pagination_lt').click(function () {
        var current = $('.pagination_div ul li.current_page');
        var temp = current.children("a").html();
        //  已经达到最左边，再点无反应
        if (temp == 1) {
            return false;
        }
        updateCurrent(current, 1, temp);
        //      这个就是当前的页数
        var current_page = $('.pagination_div ul li.current_page').children("a").html();
        selectByCounts(current_page);
    });
    //下一页
    $('.pagination_gt').click(function () {
        var current = $('.pagination_div ul li.current_page');
        var temp = current.children("a").html();
        // 到达最右边
        if (temp == 99) {
            return false;
        }
        updateCurrent(current, 2, temp);
        var current_page = $('.pagination_div ul li.current_page').children("a").html();
        //      通过这个current_page 来获取数据
        selectByCounts(current_page);

    });

    // temp 当前的值（1,2,3,4...）
    function updateCurrent(current, to, temp) {
        //    1左，2右
        var num = current.nextAll().length;
        if (to == 1) {
            if (num == 4) {
                current.siblings(":last").remove();
                current.before("<li><a>" + (temp - 1) + "</a></li>");
            }
            if (num == 3) {
                if (!(temp - 2 < 1)) {
                    current.siblings(":last").remove();
                    current.siblings(":first").before("<li><a>" + (temp - 2) + "</a></li>");
                }
            }
            current.removeClass("current_page");
            current.prev().addClass("current_page");
        } else {
            if (num == 0) {
                current.siblings(":first").remove();
                current.after("<li><a>" + (parseInt(temp) + 1) + "</a></li>");
            }
            if (num == 1) {
                current.siblings(":first").remove();
                current.siblings(":last").after("<li><a>" + (parseInt(temp) + 2) + "</a></li>");
            }
            current.removeClass("current_page");
            current.next().addClass("current_page");
        }
        bindClick();
    }
    function selectByCounts(currentCounts) {
        var $all_product = $('.all_product');
        $.ajax({
            url: 'selectByCounts.do',
            type: 'post',
            dataType: 'JSON',
            data: {counts: currentCounts},
            success: function (data) {
                $all_product.html('');
                if (data.length === 0) {
                    $all_product.append("<div class='product_content_div'>" +
                        "<div class='detail_product'>" +
                        "<input type='hidden' value= ''/>" +
                        "<div class='product_img_div'><img src='' title='暂时没有该分类的商品' /></div>" +
                        "<span class='detail_product_name'></span><br/>" +
                        "<span class='detail_product_cost'></span><br/>" +
                        "<span class='detail_buy product_1'>加入购物车</span>" +
                        "</div>" +
                        "</div>");
                }
                for (var i = 0; i < data.length; i++) {
                    $all_product.append("<div class='product_content_div'>" +
                        "<div class='detail_product'>" +
                        "<input type='hidden' value=" + data[i].id + " '/>" +
                        "<div class='product_img_div'>" +
                        "<img class='show_img' src='" + data[i].image + "' title=" + data.name + "'/>" +
                        "</div>" +
                        "<p class='show_tip'>"+data[i].remark+"</p>"+
                        "<span class='detail_product_name' value='"+data[i].id+"'>" + data[i].name + "</span><br/>" +
                        "<span class='detail_product_cost'>￥" + data[i].price + "</span><br/>" +
                        "<span class='detail_buy product_1' value='"+data[i].id+"'>加入购物车</span>" +
                        "</div>" +
                        "</div>");
                }
                //进入查看商品的详情,通过id
                $('.detail_product_name').click(function () {
                    var id = $(this).attr('value');
                    window.location.href='/selectById.do?id='+id;
                });
                insertShopCar();
            }
        });

    }
    //进入查看商品的详情,通过id
    $('.detail_product_name').click(function () {
        var id = $(this).attr('value');
        window.location.href='/selectById.do?id='+id;
    });
    function insertShopCar() {
        $('.detail_buy').click(function () {
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
    }

});

function hideParticular() {
    if ($('.particular_type_div').is(":visible")) {
        $('.particular_type_div').hide(0);
    }
    // 隐藏新版本的子分类弹出层
    if ($('.subcategory-popup').is(":visible")) {
        $('.subcategory-popup').hide();
    }
}

// 新版本的商城交互功能
function initModernMallInteractions() {
    var type_list = getTypeList();
    
    $(document).off('mouseenter', '.category-item').on('mouseenter', '.category-item', function() {
        var categoryClass = $(this).attr('class');
        var typeMatch = categoryClass.match(/type_(\d+)/);
        if (typeMatch) {
            var typeIndex = parseInt(typeMatch[1]) - 1;
            showSubcategories(typeIndex, $(this));
        }
    });
    
    $(document).off('mouseleave', '.category-item').on('mouseleave', '.category-item', function() {
        // 延迟隐藏，允许鼠标移动到弹出层
        setTimeout(function() {
            if (!$('.subcategory-popup:hover').length && !$('.category-item:hover').length) {
                $('.subcategory-popup').hide();
            }
        }, 100);
    });
    
    // 子分类弹出层悬停保持显示
    $(document).on('mouseenter', '.subcategory-popup', function() {
        $(this).show();
    });
    
    $(document).on('mouseleave', '.subcategory-popup', function() {
        $(this).hide();
    });
    
    // 子分类链接点击事件
    $(document).on('click', '.subcategory-links a', function(e) {
        e.preventDefault();
        var sortId = $(this).data('sort-id');
        if (sortId) {
            loadProductsBySort(sortId);
        }
    });
    
    // 筛选/排序按钮点击事件
    $(document).on('click', '.filter-btn', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        var sortType = $(this).data('sort');
        if (!sortType) {
            return;
        }

        var productsToSort = currentProducts.slice();
        if (sortType === 'priceAsc') {
            productsToSort.sort(function(a, b) {
                return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
            });
        } else if (sortType === 'priceDesc') {
            productsToSort.sort(function(a, b) {
                return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
            });
        } else if (sortType === 'latest') {
            productsToSort.sort(function(a, b) {
                return (parseInt(b.id, 10) || 0) - (parseInt(a.id, 10) || 0);
            });
        } else {
            // 默认排序恢复到原始顺序
            productsToSort = originalProducts.slice();
        }

        renderProducts(productsToSort);
    });
    
    // 新版本分页点击事件
    $(document).on('click', '.page-number', function() {
        $('.page-number').removeClass('active');
        $(this).addClass('active');
        
        var pageNum = $(this).text();
        loadProductsByPage(pageNum);
    });
    
    // 分页导航按钮
    $(document).on('click', '.prev-btn', function() {
        var currentPage = $('.page-number.active');
        var prevPage = currentPage.prev('.page-number');
        if (prevPage.length) {
            currentPage.removeClass('active');
            prevPage.addClass('active');
            loadProductsByPage(prevPage.text());
        }
    });
    
    $(document).on('click', '.next-btn', function() {
        var currentPage = $('.page-number.active');
        var nextPage = currentPage.next('.page-number');
        if (nextPage.length) {
            currentPage.removeClass('active');
            nextPage.addClass('active');
            loadProductsByPage(nextPage.text());
        }
    });
    
    // 新版本购物车按钮
    $(document).on('click', '.add-to-cart-btn', function() {
        var productId = $(this).attr('value') || $(this).data('product-id');
        if (productId) {
            addToCart(productId);
        }
    });
}

// 显示子分类
function showSubcategories(typeIndex, categoryElement) {
    if (typeIndex >= 0 && typeIndex < getTypeList().length) {
        var categories = getTypeList()[typeIndex];
        var html = '';
        
        categories.forEach(function(category, index) {
            html += '<div class="subcategory-section">';
            html += '<div class="subcategory-header">';
            html += '<span class="category-number">' + (index + 1) + '</span>';
            html += '<h4>' + category.name + '</h4>';
            html += '</div>';
            html += '<div class="subcategory-links">';
            
            category.content.forEach(function(item) {
                html += '<a href="#" data-sort-id="' + item.id + '">' + item.name + '</a>';
            });
            
            html += '</div></div>';
        });
        
        $('.subcategory-popup').html(html).show();
        
        var sidebarOffset = $('.category-sidebar').offset();
        var sidebarWidth = $('.category-sidebar').outerWidth();
        var gap = 24; 
        
        var popupLeft = sidebarOffset.left + sidebarWidth + gap;
        
        $('.subcategory-popup').css({
            'left': popupLeft + 'px'
        });
    }
}

// 根据分类加载商品
function loadProductsBySort(sortId) {
    // 隐藏弹出层
    $('.subcategory-popup').hide();
    
    $.ajax({
        url: 'selectBySort.do',
        type: 'post',
        dataType: 'JSON',
        data: {sort: sortId},
        success: function(data) {
            updateProductCache(data);
            renderProducts(data);
            ensureCategoryEvents();
        },
        error: function() {
            console.error('加载商品失败');
        }
    });
}

// 根据页码加载商品
function loadProductsByPage(pageNum) {
    // 隐藏弹出层
    $('.subcategory-popup').hide();
    
    $.ajax({
        url: 'selectByCounts.do',
        type: 'post',
        dataType: 'JSON',
        data: {counts: pageNum},
        success: function(data) {
            updateProductCache(data);
            renderProducts(data);
            updateResultCount(data.length);
            ensureCategoryEvents();
        },
        error: function() {
            console.error('加载商品失败');
        }
    });
}

function ensureCategoryEvents() {
}

// 渲染商品到新版本网格
function renderProducts(products) {
    var html = '';
    
    if (!products || products.length === 0) {
        html = '<div class="product-card"><div class="product-info"><h3>暂无商品</h3></div></div>';
    } else {
        products.forEach(function(product) {
            html += '<div class="product-card">';
            html += '<input type="hidden" value="' + product.id + '" name="id"/>';
            html += '<div class="product-image">';
            html += '<img src="' + product.image + '" alt="' + product.name + '" class="product-img"/>';
            html += '<div class="product-overlay">';
            html += '<p class="product-description">' + (product.remark || '暂无描述') + '</p>';
            html += '</div></div>';
            html += '<div class="product-info">';
            // 状态标签（使用 level 字段）
            var level = product.level || product.shopLevel;
            var badgeText = '';
            if (level >= 4) {
                badgeText = 'Almost New';
            } else if (level === 3) {
                badgeText = 'Good Condition';
            } else if (level > 0 && level <= 2) {
                badgeText = 'Used';
            }
            if (badgeText) {
                html += '<div class="product-badge"><span>' + badgeText + '</span></div>';
            }

            html += '<h3 class="product-title" data-product-id="' + product.id + '">' + product.name + '</h3>';
            html += '<div class="product-price">';
            html += '<span class="price-symbol">¥</span>';
            html += '<span class="price-value">' + product.price + '</span>';
            html += '</div>';
            html += '<button class="add-to-cart-btn" data-product-id="' + product.id + '">';
            html += '<i class="fas fa-shopping-cart"></i>';
            html += '<span>加入购物车</span>';
            html += '</button></div></div>';
        });
    }
    
    $('.products-grid').html(html);
    
    // 绑定商品标题点击事件
    $('.product-title').click(function() {
        var productId = $(this).data('product-id');
        window.location.href = '/selectById.do?id=' + productId;
    });

    // 重新应用关键词高亮
    applyKeywordHighlight();
}

// 更新商品数量显示
function updateResultCount(count) {
    $('.result-count strong').text(count);
}

// 添加到购物车
function addToCart(productId) {
    $.ajax({
        url: '/insertGoodsCar.do',
        dataType: 'JSON',
        type: 'post',
        data: {id: productId},
        success: function(data) {
            var result = data.result;
            if (result == '2') {
                alert('您还未登录，请先登录！！！');
            } else if (result == '1') {
                alert('加入购物车成功');
            } else if (result == '0') {
                alert('加入购物车失败');
            } else {
                alert('发生了错误，请检测网络');
            }
        },
        error: function() {
            alert('网络错误，请稍后重试');
        }
    });
}

// 从当前 DOM 初始化产品缓存（用于排序）
function initCurrentProductsFromDom() {
    var products = [];
    $('.products-grid .product-card').each(function() {
        var $card = $(this);
        var id = $card.find('input[name="id"]').val();
        var name = $.trim($card.find('.product-title').text());
        var priceText = $card.find('.price-value').text();
        var price = priceText ? priceText.replace(/[^\d.]/g, '') : '';
        var image = $card.find('.product-img').attr('src');

        if (id) {
            products.push({
                id: id,
                name: name,
                price: price,
                image: image
            });
        }
    });
    currentProducts = products.slice();
    originalProducts = products.slice();
}

// 更新缓存（用于 AJAX 加载）
function updateProductCache(list) {
    if (!$.isArray(list)) {
        return;
    }
    currentProducts = list.slice();
    originalProducts = list.slice();
}

// 关键词高亮
function applyKeywordHighlight() {
    if (!currentKeyword) {
        return;
    }
    var kw = currentKeyword;
    if (!kw) return;

    $('.product-title').each(function() {
        var $title = $(this);
        var text = $title.text();
        var regex = new RegExp('(' + escapeRegExp(kw) + ')', 'ig');
        var newHtml = text.replace(regex, '<span class="keyword-highlight">$1</span>');
        $title.html(newHtml);
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}