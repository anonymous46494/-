package com.example.demo.controller;


import com.example.demo.bean.News;
import com.example.demo.mapper.NewsMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@CrossOrigin
@RestController
public class Newscontroller {
    @Autowired
    NewsMapper newsMapper;

    /*列出所有资讯*/
    @RequestMapping("get/news/all")
    public PageInfo<News> getNews(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<News> list = newsMapper.getNews();
        PageInfo<News> pageInfo = new PageInfo<>(list);
        return pageInfo;
    }

    /*根据title获取资讯*/
    @GetMapping("get/news")
    public List<News> getNewsById(@RequestParam("title") String title) {
        return newsMapper.getNewsById(title);
    }

    /*添加资讯百科*/
    @RequestMapping("add/news")
    public Map<String, Object> addNews(String title, String author, String img, String cont, String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        List<News> result = newsMapper.getNewsById(title);
        /*根据中文名判断是否存在*/
        if (result.size() == 0) {
            String status = "已发布";
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss ");
            String create_time=sdf.format(new Date());
            Integer reading = 0;
            newsMapper.addNews(title, author, img, cont, cont_show, status,reading,create_time);
            resultMap.put("code", 200);
            resultMap.put("msg", "添加资讯信息成功");
        } else {
            resultMap.put("code", 400);
            resultMap.put("msg", "添加资讯信息失败，重复添加");
        }
        return resultMap;
    }

    /*删除资讯信息*/
    @RequestMapping("del/news")
    public Map<String, Object> delNewsById(String title) {
        Map<String, Object> resultMap = new HashMap<>();
        newsMapper.delNewsById(title);
        resultMap.put("code", 200);
        resultMap.put("msg", "删除资讯信息成功");
        return resultMap;
    }

    /*更新资讯百科*/
    @RequestMapping("up/news")
    public Map<String, Object> upNews(Integer id, String title, String author, String img, String cont, String cont_show,String status) {
        Map<String, Object> resultMap = new HashMap<>();
        newsMapper.updateNews(id, title, author, img, cont, cont_show,status);
        return resultMap;
    }

    /*模糊搜索资讯信息*/
    @PostMapping("search/news")
    public List<News> searchNews(String key, String value) {
        if(key.equals("title")){
            return newsMapper.searchNewsByTit(value);
        }else {
            return newsMapper.searchNewsBySt(value);
        }

    }
}
