package com.wsk.controller;

import com.wsk.pojo.UserInformation;
import com.wsk.response.BaseResponse;
import com.wsk.service.UserInformationService;
import com.wsk.tool.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Properties;
import java.util.Random;

@Controller
public class SendEmailController {

    @Resource
    private UserInformationService userInformationService;
    private static final Logger log = LoggerFactory.getLogger(SendEmailController.class);

    @RequestMapping(value = "sendCode.do", method = {RequestMethod.POST, RequestMethod.GET})
    @ResponseBody
    public BaseResponse sendEmail(HttpServletRequest req, HttpServletResponse res,
                                  @RequestParam String phone, @RequestParam String action,
                                  @RequestParam String token) {
        res.setContentType("text/html;charset=UTF-8");
        String sendCodeToken = (String) req.getSession().getAttribute("token");
        if (StringUtils.getInstance().isNullOrEmpty(sendCodeToken) || !sendCodeToken.equals(token)) {
            return BaseResponse.fail();
        }
        if (!StringUtils.getInstance().isPhone(phone)) {
            return BaseResponse.fail();
        }
        if ("forget".equals(action)) {
            if (!isUserPhoneExists(phone)) {
                return BaseResponse.fail();
            }
        } else if ("register".equals(action)) {
            if (isUserPhoneExists(phone)) {
                return BaseResponse.fail();
            }
        }
        getRandomForCodePhone(req);
        Properties prop = new Properties();
        prop.setProperty("mail.host", "smtp.139.com");
        prop.setProperty("mail.transport.protocol", "smtp");
        prop.setProperty("mail.smtp.auth", "true");
        prop.setProperty("mail.smtp.port", "25");
        try {
            String realPhone = phone;
            req.getSession().setAttribute("phone", realPhone);
            return BaseResponse.success();
        } catch (Exception me) {
            me.printStackTrace();
            return BaseResponse.fail();
        }
    }

    private void getRandomForCodePhone(HttpServletRequest req) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            sb.append(random.nextInt(10));
        }
        log.info("短信验证码={}", sb);
        System.out.println(sb.toString());
        req.getSession().setAttribute("codePhone", sb.toString());
    }

    private boolean isUserPhoneExists(String phone) {
        boolean result = false;
        try {
            int id = userInformationService.selectIdByPhone(phone);
            if (id == 0) {
                return result;
            }
            UserInformation userInformation = userInformationService.selectByPrimaryKey(id);

            if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
                return false;
            }
            String userPhone = userInformation.getPhone();
            result = !StringUtils.getInstance().isNullOrEmpty(userPhone);
        } catch (Exception e) {
            e.printStackTrace();
            return result;
        }
        return result;
    }


}
