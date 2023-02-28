package com.example.demo.controller;

import com.example.demo.bean.Teach;
import com.example.demo.mapper.TeachMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class TeachController {

    @Autowired
    TeachMapper teachMapper;


    /*列出所有资讯*/
    @RequestMapping("get/teach/all")
    public PageInfo<Teach> getTeach(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Teach> list = teachMapper.getTeach();
        PageInfo<Teach> pageInfo = new PageInfo<>(list);
        return pageInfo;
    }

    /*根据title获取资讯*/
    @GetMapping("get/teach")
    public List<Teach> getTeachById(@RequestParam("title") String title) {
        return teachMapper.getTeachById(title);
    }

    /*添加资讯百科*/
    @RequestMapping("add/teach")
    public Map<String, Object> addTeach(String title, String author, String img, String cont, String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        List<Teach> result = teachMapper.getTeachById(title);
        /*根据中文名判断是否存在*/
        if (result.size() == 0) {
            String status = "已发布";
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss ");
            String create_time=sdf.format(new Date());
            Integer reading = 0;
            teachMapper.addTeach(title, author, img, cont, cont_show, status,reading,create_time);
            resultMap.put("code", 200);
            resultMap.put("msg", "添加资讯信息成功");
        } else {
            resultMap.put("code", 400);
            resultMap.put("msg", "添加资讯信息失败，重复添加");
        }
        return resultMap;
    }

    /*删除资讯信息*/
    @RequestMapping("del/teach")
    public Map<String, Object> delTeachById(String title) {
        Map<String, Object> resultMap = new HashMap<>();
        teachMapper.delTeachById(title);
        resultMap.put("code", 200);
        resultMap.put("msg", "删除资讯信息成功");
        return resultMap;
    }

    /*更新资讯百科*/
    @RequestMapping("up/teach")
    public Map<String, Object> upTeach(Integer id, String title, String author, String img, String cont, String cont_show,String status) {
        Map<String, Object> resultMap = new HashMap<>();
        teachMapper.updateTeach(id, title, author, img, cont, cont_show,status);
        return resultMap;
    }

    /*模糊搜索资讯信息*/
    @PostMapping("search/teach")
    public List<Teach> searchTeach(String key, String value) {
        if(key.equals("title")){
            return teachMapper.searchTeachByTit(value);
        }else {
            return teachMapper.searchTeachBySt(value);
        }

    }

}
