package com.wsk.controller;

import com.wsk.pojo.UserInformation;
import com.wsk.pojo.UserPassword;
import com.wsk.response.BaseResponse;
import com.wsk.service.UserInformationService;
import com.wsk.service.UserPasswordService;
import com.wsk.tool.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@Controller
public class RegisterController {
    @Resource
    private UserPasswordService userPasswordService;

    @Resource
    private UserInformationService userInformationService;

    @RequestMapping("/insertUser.do")
    @ResponseBody
    public BaseResponse insertUser(HttpServletRequest request,
                                   @RequestParam String password, @RequestParam String token) {
        String realPhone = (String) request.getSession().getAttribute("phone");
        String insertUserToken = (String) request.getSession().getAttribute("token");
        System.out.println("注册请求 - session中的phone: " + realPhone + ", token: " + token);
        
        if (StringUtils.getInstance().isNullOrEmpty(insertUserToken) || !insertUserToken.equals(token)) {
            System.out.println("注册失败：Token验证失败");
            return BaseResponse.fail();
        }
        if (StringUtils.getInstance().isNullOrEmpty(realPhone)) {
            System.out.println("注册失败：Session中的手机号为空，可能Session已过期或丢失");
            return BaseResponse.fail();
        }
        // 检查手机号是否已被注册
        int uid = userInformationService.selectIdByPhone(realPhone);
        System.out.println("查询手机号 " + realPhone + " 的结果：uid=" + uid);
        if (uid != 0) {
            // 手机号已被注册，返回失败
            System.out.println("注册失败：手机号 " + realPhone + " 已被注册，uid=" + uid);
            return BaseResponse.fail();
        }

        UserInformation userInformation = new UserInformation();
        userInformation.setPhone(realPhone);
        userInformation.setCreatetime(new Date());
        String username = (String) request.getSession().getAttribute("name");
        if (StringUtils.getInstance().isNullOrEmpty(username)) {
            return BaseResponse.fail();
        }
        userInformation.setUsername(username);
        userInformation.setModified(new Date());
        int result;
        result = userInformationService.insertSelective(userInformation);
        if (result == 1) {
            uid = userInformationService.selectIdByPhone(realPhone);
            String newPassword = StringUtils.getInstance().getMD5(password);
            UserPassword userPassword = new UserPassword();
            userPassword.setModified(new Date());
            userPassword.setUid(uid);
            userPassword.setPassword(newPassword);
            result = userPasswordService.insertSelective(userPassword);
            if (result != 1) {
                userInformationService.deleteByPrimaryKey(uid);
                return BaseResponse.fail();
            } else {
                userInformation = userInformationService.selectByPrimaryKey(uid);
                request.getSession().setAttribute("userInformation", userInformation);
                request.getSession().setAttribute("uid", uid);
                return BaseResponse.success();
            }
        }
        return BaseResponse.fail();
    }
}
