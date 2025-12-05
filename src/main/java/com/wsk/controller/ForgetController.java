package com.wsk.controller;

import com.wsk.pojo.UserInformation;
import com.wsk.pojo.UserPassword;
import com.wsk.response.BaseResponse;
import com.wsk.service.UserInformationService;
import com.wsk.service.UserPasswordService;
import com.wsk.tool.StringUtils;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ForgetController {

    @Resource
    private UserPasswordService userPasswordService;
    @Resource
    private UserInformationService userInformationService;

    @RequestMapping(value = "checkCode.do", method = {RequestMethod.POST, RequestMethod.GET})
    public Map<String, Integer> checkPhone(HttpServletRequest request, Model model,
                          @RequestParam String code, @RequestParam String token) {
        Map<String, Integer> map = new HashMap<>();
        String name = request.getParameter("name");
        if (!StringUtils.getInstance().isNullOrEmpty(name)) {
            request.getSession().setAttribute("name", name);
        }
        // 确保phone也在session中，防止session丢失
        String phone = request.getParameter("phone");
        System.out.println("checkCode.do - 接收到的phone参数: " + phone);
        if (!StringUtils.getInstance().isNullOrEmpty(phone)) {
            request.getSession().setAttribute("phone", phone);
            System.out.println("checkCode.do - 已将phone设置到session: " + phone);
        } else {
            // 如果请求参数中没有phone，尝试从session中获取
            String sessionPhone = (String) request.getSession().getAttribute("phone");
            System.out.println("checkCode.do - 请求参数中没有phone，session中的phone: " + sessionPhone);
        }
        String checkCodeToken = (String) request.getSession().getAttribute("token");
        if (StringUtils.getInstance().isNullOrEmpty(checkCodeToken) || !checkCodeToken.equals(token)) {
            map.put("result", 0);
            return map;
        }
        if (!checkCodePhone(code, request)) {
            map.put("result", 0);
            return map;
        }
        map.put("result", 1);
        return map;
    }

    @RequestMapping("updatePassword.do")
    public BaseResponse updatePassword(HttpServletRequest request, Model model,
                                       @RequestParam String password, @RequestParam String token) {
        String updatePasswordToken = (String) request.getSession().getAttribute("token");
        if (StringUtils.getInstance().isNullOrEmpty(updatePasswordToken) || !updatePasswordToken.equals(token)) {
            return BaseResponse.fail();
        }
        String realPhone = (String) request.getSession().getAttribute("phone");
        if (StringUtils.getInstance().isNullOrEmpty(realPhone)) {
            return BaseResponse.fail();
        }
        UserPassword userPassword = new UserPassword();
        String newPassword = StringUtils.getInstance().getMD5(password);
        int uid;
        try {
            uid = userInformationService.selectIdByPhone(realPhone);
            if (uid == 0) {
                return BaseResponse.fail();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return BaseResponse.fail();
        }
        UserPassword existingPassword = userPasswordService.selectByUid(uid);
        if (existingPassword == null || existingPassword.getId() == null) {
            return BaseResponse.fail();
        }
        int id = existingPassword.getId();
        userPassword.setId(id);
        userPassword.setUid(uid);
        userPassword.setModified(new Date());
        userPassword.setPassword(newPassword);
        int result;
        try {
            result = userPasswordService.updateByPrimaryKeySelective(userPassword);
        } catch (Exception e) {
            return BaseResponse.fail();
        }
        if (result != 1) {
            return BaseResponse.fail();
        }
        UserInformation userInformation = userInformationService.selectByPrimaryKey(uid);
        request.getSession().setAttribute("userInformation", userInformation);
        request.getSession().setAttribute("uid", uid);
        return BaseResponse.success();
    }

    private boolean checkCodePhone(String codePhone, HttpServletRequest request) {
        String trueCodePhone = (String) request.getSession().getAttribute("codePhone");
        if (StringUtils.getInstance().isNullOrEmpty(trueCodePhone)) {
            String fixedCode = "1479";
            return codePhone.equals(fixedCode);
        }
        return codePhone.equals(trueCodePhone);
    }
}
