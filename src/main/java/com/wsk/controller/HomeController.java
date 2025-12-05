package com.wsk.controller;

import com.wsk.bean.ShopInformationBean;
import com.wsk.pojo.*;
import com.wsk.service.*;
import com.wsk.tool.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {
    @Resource
    private ShopInformationService shopInformationService;
    @Resource
    private SpecificeService specificeService;
    @Resource
    private ClassificationService classificationService;
    @Resource
    private AllKindsService allKindsService;
    @Resource
    private ShopContextService shopContextService;


    @RequestMapping(value = {"/", "/home.do"})
    public String home(HttpServletRequest request, Model model) {
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (!StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            model.addAttribute("userInformation", userInformation);
        } else {
            userInformation = new UserInformation();
            model.addAttribute("userInformation", userInformation);
        }
        try {
            List<ShopInformation> shopInformations = selectTen(1, 5);
            List<ShopInformationBean> list = new ArrayList<>();
            int counts = getShopCounts();
            model.addAttribute("shopInformationCounts", counts);
            String stringBuffer;
            for (ShopInformation shopInformation : shopInformations) {
                stringBuffer = getSortName(shopInformation.getSort());
                ShopInformationBean shopInformationBean = new ShopInformationBean();
                shopInformationBean.setId(shopInformation.getId());
                shopInformationBean.setName(shopInformation.getName());
                shopInformationBean.setLevel(shopInformation.getLevel());
                shopInformationBean.setPrice(shopInformation.getPrice().doubleValue());
                shopInformationBean.setRemark(shopInformation.getRemark());
                shopInformationBean.setSort(stringBuffer);
                shopInformationBean.setQuantity(shopInformation.getQuantity());
                shopInformationBean.setUid(shopInformation.getUid());
                shopInformationBean.setTransaction(shopInformation.getTransaction());
                shopInformationBean.setImage(shopInformation.getImage());
                list.add(shopInformationBean);
            }
            model.addAttribute("shopInformationBean", list);
        } catch (Exception e) {
            e.printStackTrace();
            return "page/login_page";
        }
        @SuppressWarnings("unchecked")
        List<ShopInformationBean> recentViewed =
                (List<ShopInformationBean>) request.getSession().getAttribute("recentViewed");
        if (recentViewed != null && recentViewed.size() > 0) {
            model.addAttribute("recentViewed", recentViewed);
        }
        return "index";
    }

    @RequestMapping(value = "/suggestions.do")
    public String suggestions(HttpServletRequest request, Model model) {
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            userInformation = new UserInformation();
        }
        model.addAttribute("userInformation", userInformation);
        return "page/suggestions";
    }

    @RequestMapping(value = "/contact_us.do")
    public String contactUs(HttpServletRequest request, Model model) {
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            userInformation = new UserInformation();
        }
        model.addAttribute("userInformation", userInformation);
        return "page/contact_us";
    }

    //进入商城
    @RequestMapping(value = "/mall_page.do")
    public String mallPage(HttpServletRequest request, Model model) {
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            userInformation = new UserInformation();
            model.addAttribute("userInformation", userInformation);
        } else {
            model.addAttribute("userInformation", userInformation);
        }
        try {
            List<ShopInformation> shopInformations = selectTen(1, 12);
            List<ShopInformationBean> list = new ArrayList<>();
            int counts = getShopCounts();
            model.addAttribute("shopInformationCounts", counts);
            String sortName;
            for (ShopInformation shopInformation : shopInformations) {
                int sort = shopInformation.getSort();
                sortName = getSortName(sort);
                ShopInformationBean shopInformationBean = new ShopInformationBean();
                shopInformationBean.setId(shopInformation.getId());
                shopInformationBean.setName(shopInformation.getName());
                shopInformationBean.setLevel(shopInformation.getLevel());
                shopInformationBean.setRemark(shopInformation.getRemark());
                shopInformationBean.setPrice(shopInformation.getPrice().doubleValue());
                shopInformationBean.setSort(sortName);
                shopInformationBean.setQuantity(shopInformation.getQuantity());
                shopInformationBean.setTransaction(shopInformation.getTransaction());
                shopInformationBean.setUid(shopInformation.getUid());
                shopInformationBean.setImage(shopInformation.getImage());
                list.add(shopInformationBean);
            }
            model.addAttribute("shopInformationBean", list);
        } catch (Exception e) {
            e.printStackTrace();
            return "page/login_page";
        }

        @SuppressWarnings("unchecked")
        List<ShopInformationBean> recentViewed =
                (List<ShopInformationBean>) request.getSession().getAttribute("recentViewed");
        if (recentViewed != null && recentViewed.size() > 0) {
            model.addAttribute("recentViewed", recentViewed);
        }
        return "page/mall_page";
    }

    private String getSortName(int sort) {
        StringBuilder stringBuffer = new StringBuilder();
        Specific specific = selectSpecificBySort(sort);
        int cid = specific.getCid();
        Classification classification = selectClassificationByCid(cid);
        int aid = classification.getAid();
        AllKinds allKinds = selectAllKindsByAid(aid);
        stringBuffer.append(allKinds.getName());
        stringBuffer.append("-");
        stringBuffer.append(classification.getName());
        stringBuffer.append("-");
        stringBuffer.append(specific.getName());
        return stringBuffer.toString();
    }

    @RequestMapping(value = "/getAllKinds.do")
    @ResponseBody
    public List<AllKinds> getAllKind() {
        return getAllKinds();
    }
    @RequestMapping(value = "/getClassification.do", method = RequestMethod.POST)
    @ResponseBody
    public List<Classification> getClassificationByAid(@RequestParam int id) {
        return selectAllClassification(id);
    }

    @RequestMapping(value = "/getSpecific.do")
    @ResponseBody
    public List<Specific> getSpecificByCid(@RequestParam int id) {
        return selectAllSpecific(id);
    }

    @RequestMapping(value = "/getShopsCounts.do")
    @ResponseBody
    public Map getShopsCounts() {
        Map<String, Integer> map = new HashMap<>();
        int counts = 0;
        try {
            counts = shopInformationService.getCounts();
        } catch (Exception e) {
            e.printStackTrace();
            map.put("counts", counts);
            return map;
        }
        map.put("counts", counts);
        return map;
    }

    @RequestMapping(value = "/getShops.do")
    @ResponseBody
    public List getShops(@RequestParam int start) {
        List<ShopInformation> list = new ArrayList<>();
        try {
            int end = 12;
            list = selectTen(start, end);
        } catch (Exception e) {
            e.printStackTrace();
            return list;
        }
        return list;
    }


    private List<ShopInformation> selectTen(int start, int end) {
        Map map = new HashMap();
        map.put("start", (start - 1) * end);
        map.put("end", end);
        List<ShopInformation> list = shopInformationService.selectTen(map);
        return list;
    }

    private Specific selectSpecificBySort(int sort) {
        return specificeService.selectByPrimaryKey(sort);
    }

    private Classification selectClassificationByCid(int cid) {
        return classificationService.selectByPrimaryKey(cid);
    }

    private AllKinds selectAllKindsByAid(int aid) {
        return allKindsService.selectByPrimaryKey(aid);
    }

    private List<AllKinds> getAllKinds() {
        return allKindsService.selectAll();
    }

    private List<Classification> selectAllClassification(int aid) {
        return classificationService.selectByAid(aid);
    }

    private List<Specific> selectAllSpecific(int cid) {
        return specificeService.selectByCid(cid);
    }

    private int getShopCounts() {
        return shopInformationService.getCounts();
    }

    private int getShopContextCounts(int sid) {
        return shopContextService.getCounts(sid);
    }

    private List<ShopContext> selectShopContextBySid(int sid, int start) {
        return shopContextService.findById(sid, (start - 1) * 10);
    }
}
