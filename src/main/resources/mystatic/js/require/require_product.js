/**
 * 求购商品页面交互功能
 */
$(function() {
    // 文本域字符计数
    $('.form-textarea').on('input', function() {
        var currentLength = $(this).val().length;
        var maxLength = $(this).attr('maxlength');
        
        $('.current-length').text(currentLength);
        
        // 接近限制时改变颜色
        if (currentLength > maxLength * 0.8) {
            $('.current-length').css('color', '#e74c3c');
        } else {
            $('.current-length').css('color', '#2f8f83');
        }
    });
    
    // 表单验证增强
    $('.form-input, .form-select, .form-textarea').on('blur', function() {
        var $this = $(this);
        var value = $this.val().trim();
        
        if ($this.prop('required') && !value) {
            $this.css('border-color', '#e74c3c');
        } else {
            $this.css('border-color', '#e1e8e6');
        }
    });
    
    // 数字输入验证
    $('input[type="number"]').on('input', function() {
        var value = parseFloat($(this).val());
        var min = parseFloat($(this).attr('min'));
        
        if (value < min) {
            $(this).css('border-color', '#e74c3c');
        } else {
            $(this).css('border-color', '#e1e8e6');
        }
    });
    
    // 表单提交前验证
    $('.require-form').on('submit', function(e) {
        var isValid = true;
        var $form = $(this);
        
        // 检查必填字段
        $form.find('[required]').each(function() {
            var $field = $(this);
            var value = $field.val().trim();
            
            if (!value) {
                $field.css('border-color', '#e74c3c');
                isValid = false;
            }
        });
        
        // 检查数字字段
        $form.find('input[type="number"]').each(function() {
            var $field = $(this);
            var value = parseFloat($field.val());
            var min = parseFloat($field.attr('min'));
            
            if (value < min) {
                $field.css('border-color', '#e74c3c');
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            alert('请检查并填写所有必填字段');
        }
    });
    
    // 分类联动（如果需要的话）
    $('.choose_first_type').on('change', function() {
        var selectedValue = $(this).val();
        // 这里可以根据第一级分类更新第二级分类选项
        console.log('选择的分类:', selectedValue);
    });
});
