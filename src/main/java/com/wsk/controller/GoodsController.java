package com.wsk.controller;

import com.wsk.bean.ShopContextBean;
import com.wsk.bean.ShopInformationBean;
import com.wsk.bean.UserWantBean;
import com.wsk.pojo.*;
import com.wsk.service.*;
import com.wsk.token.TokenProccessor;
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
public class GoodsController {
    @Resource
    private ShopInformationService shopInformationService;
    @Resource
    private ShopContextService shopContextService;
    @Resource
    private UserInformationService userInformationService;
    @Resource
    private SpecificeService specificeService;
    @Resource
    private ClassificationService classificationService;
    @Resource
    private AllKindsService allKindsService;
    @Resource
    private UserWantService userWantService;

    //进入到发布商品页面
    @RequestMapping(value = "/publish_product.do", method = RequestMethod.GET)
    public String publish(HttpServletRequest request, Model model) {
        //先判断用户有没有登录
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            //如果没有登录
            return "redirect:/login.do";
        } else {
            model.addAttribute("userInformation", userInformation);
        }
        //如果登录了，判断该用户有没有经过认证
        try {
            String realName = userInformation.getRealname();
            String sno = userInformation.getSno();
            String dormitory = userInformation.getDormitory();
            if (StringUtils.getInstance().isNullOrEmpty(realName) || StringUtils.getInstance().isNullOrEmpty(sno) || StringUtils.getInstance().isNullOrEmpty(dormitory)) {
                //没有
                model.addAttribute("message", "请先认证真实信息");
                return "redirect:personal_info.do";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/login.do";
        }
        String goodsToken = TokenProccessor.getInstance().makeToken();
        request.getSession().setAttribute("goodsToken", goodsToken);
        model.addAttribute("shopInformation", new ShopInformation());
        model.addAttribute("action", 1);
        model.addAttribute("token", goodsToken);
        return "page/publish_product";
    }

    //模糊查询商品 + 价格区间筛选
    @RequestMapping(value = "/findShopByName.do", method = RequestMethod.GET)
    public String findByName(HttpServletRequest request, Model model,
                             @RequestParam(required = false) String name,
                             @RequestParam(required = false) Double minPrice,
                             @RequestParam(required = false) Double maxPrice) {
        try {
            if (name == null) {
                name = "";
            }
            // 如果没有填写关键词，则直接回到商城首页，避免全表模糊查询
            if (StringUtils.getInstance().isNullOrEmpty(name)) {
                return "redirect:/mall_page.do";
            }

            List<ShopInformation> shopInformations = shopInformationService.selectByName(name);
            // 价格区间过滤（在内存中过滤，避免改动数据库层）
            List<ShopInformation> filtered = new ArrayList<>();
            for (ShopInformation s : shopInformations) {
                double price = s.getPrice().doubleValue();
                if (minPrice != null && price < minPrice) {
                    continue;
                }
                if (maxPrice != null && price > maxPrice) {
                    continue;
                }
                filtered.add(s);
            }

            UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
            if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
                userInformation = new UserInformation();
                model.addAttribute("userInformation", userInformation);
            } else {
                model.addAttribute("userInformation", userInformation);
            }
            List<ShopInformationBean> shopInformationBeans = new ArrayList<>();
            String sortName;
            for (ShopInformation shopInformation : filtered) {
                int sort = shopInformation.getSort();
                sortName = getSort(sort);
                ShopInformationBean shopInformationBean = new ShopInformationBean();
                shopInformationBean.setId(shopInformation.getId());
                shopInformationBean.setName(shopInformation.getName());
                shopInformationBean.setLevel(shopInformation.getLevel());
                shopInformationBean.setRemark(shopInformation.getRemark());
                shopInformationBean.setPrice(shopInformation.getPrice().doubleValue());
                shopInformationBean.setQuantity(shopInformation.getQuantity());
                shopInformationBean.setTransaction(shopInformation.getTransaction());
                shopInformationBean.setSort(sortName);
                shopInformationBean.setUid(shopInformation.getUid());
                shopInformationBean.setImage(shopInformation.getImage());
                shopInformationBeans.add(shopInformationBean);
            }
            model.addAttribute("shopInformationBean", shopInformationBeans);
            // 回填搜索条件
            model.addAttribute("keyword", name);
            model.addAttribute("minPrice", minPrice);
            model.addAttribute("maxPrice", maxPrice);
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:mall_page.do";
        }
        return "page/mall_page";
    }

    //进入查看商品详情
    @RequestMapping(value = "/selectById.do")
    public String selectById(@RequestParam int id,
                             HttpServletRequest request, Model model) {
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            userInformation = new UserInformation();
            model.addAttribute("userInformation", userInformation);
        }
        try {
            ShopInformation shopInformation = shopInformationService.selectByPrimaryKey(id);
            model.addAttribute("shopInformation", shopInformation);
            List<ShopContext> shopContexts = shopContextService.selectById(id);
            List<ShopContextBean> shopContextBeans = new ArrayList<>();
            for (ShopContext s : shopContexts) {
                ShopContextBean shopContextBean = new ShopContextBean();
                UserInformation u = userInformationService.selectByPrimaryKey(s.getUid());
                shopContextBean.setContext(s.getContext());
                shopContextBean.setId(s.getId());
                shopContextBean.setModified(s.getModified());
                shopContextBean.setUid(u.getId());
                shopContextBean.setUsername(u.getUsername());
                shopContextBeans.add(shopContextBean);
            }
            String sort = getSort(shopInformation.getSort());
            String goodsToken = TokenProccessor.getInstance().makeToken();
            request.getSession().setAttribute("goodsToken", goodsToken);
            model.addAttribute("token", goodsToken);
            model.addAttribute("sort", sort);
            model.addAttribute("userInformation", userInformation);
            model.addAttribute("shopContextBeans", shopContextBeans);

            // 更新最近浏览记录（保存在 Session 中）
            updateRecentViewed(request, shopInformation);
            return "page/product_info";
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/";
        }
    }

    //进入到求购商城
    @RequestMapping(value = "/require_mall.do")
    public String requireMall(HttpServletRequest request, Model model) {
        UserInformation userInformation = (UserInformation) request.getSession().getAttribute("userInformation");
        if (StringUtils.getInstance().isNullOrEmpty(userInformation)) {
            userInformation = new UserInformation();
            model.addAttribute("userInformation", userInformation);
        } else {
            model.addAttribute("userInformation", userInformation);
        }
        List<UserWant> userWants = userWantService.selectAll();
        List<UserWantBean> list = new ArrayList<>();
        for (UserWant userWant : userWants) {
            UserWantBean u = new UserWantBean();
            u.setSort(getSort(userWant.getSort()));
            u.setRemark(userWant.getRemark());
            u.setQuantity(userWant.getQuantity());
            u.setPrice(userWant.getPrice().doubleValue());
            u.setUid(userWant.getUid());
            u.setId(userWant.getId());
            u.setModified(userWant.getModified());
            u.setName(userWant.getName());
            list.add(u);
        }
        model.addAttribute("list", list);
        return "page/require_mall";
    }

    //通过id查看商品的详情
    @RequestMapping(value = "/findShopById.do")
    @ResponseBody
    public ShopInformation findShopById(@RequestParam int id) {
        return shopInformationService.selectByPrimaryKey(id);
    }

    //通过分类选择商品
    @RequestMapping(value = "/selectBySort.do")
    @ResponseBody
    public List<ShopInformation> selectBySort(@RequestParam int sort) {
        return shopInformationService.selectBySort(sort);
    }

    //分页查询
    @RequestMapping(value = "/selectByCounts.do")
    @ResponseBody
    public List<ShopInformation> selectByCounts(@RequestParam int counts) {
        Map<String, Integer> map = new HashMap<>();
        map.put("start", (counts - 1) * 12);
        map.put("end", 12);
        return shopInformationService.selectTen(map);
    }
//    //通过id查看商品详情
//    @RequestMapping(value = "/showShop")
//    public String showShop(@RequestParam int id, HttpServletRequest request, Model model) {
//        ShopInformation shopInformation =
//    }

    //获取最详细的分类，第三层
    private Specific selectSpecificBySort(int sort) {
        return specificeService.selectByPrimaryKey(sort);
    }

    //获得第二层分类
    private Classification selectClassificationByCid(int cid) {
        return classificationService.selectByPrimaryKey(cid);
    }

    //获得第一层分类
    private AllKinds selectAllKindsByAid(int aid) {
        return allKindsService.selectByPrimaryKey(aid);
    }

    private String getSort(int sort) {
        StringBuilder sb = new StringBuilder();
        Specific specific = selectSpecificBySort(sort);
        int cid = specific.getCid();
        Classification classification = selectClassificationByCid(cid);
        int aid = classification.getAid();
        AllKinds allKinds = selectAllKindsByAid(aid);
        String allName = allKinds.getName();
        sb.append(allName);
        sb.append("-");
        sb.append(classification.getName());
        sb.append("-");
        sb.append(specific.getName());
        return sb.toString();
    }

    /**
     * 将当前浏览的商品加入最近浏览列表（Session）
     */
    @SuppressWarnings("unchecked")
    private void updateRecentViewed(HttpServletRequest request, ShopInformation shopInformation) {
        List<ShopInformationBean> recentList =
                (List<ShopInformationBean>) request.getSession().getAttribute("recentViewed");
        if (recentList == null) {
            recentList = new ArrayList<>();
        }
        // 先移除已存在的同一商品，避免重复
        int currentId = shopInformation.getId();
        List<ShopInformationBean> toRemove = new ArrayList<>();
        for (ShopInformationBean bean : recentList) {
            if (bean.getId() == currentId) {
                toRemove.add(bean);
            }
        }
        recentList.removeAll(toRemove);

        // 组装展示用的 Bean
        ShopInformationBean bean = new ShopInformationBean();
        bean.setId(shopInformation.getId());
        bean.setName(shopInformation.getName());
        bean.setLevel(shopInformation.getLevel());
        bean.setRemark(shopInformation.getRemark());
        bean.setPrice(shopInformation.getPrice().doubleValue());
        bean.setQuantity(shopInformation.getQuantity());
        bean.setTransaction(shopInformation.getTransaction());
        bean.setUid(shopInformation.getUid());
        bean.setImage(shopInformation.getImage());
        bean.setSort(getSort(shopInformation.getSort()));

        // 添加到列表最前面
        recentList.add(0, bean);
        // 最多保留 6 条记录
        int maxSize = 6;
        if (recentList.size() > maxSize) {
            recentList = recentList.subList(0, maxSize);
        }
        request.getSession().setAttribute("recentViewed", recentList);
    }

}
