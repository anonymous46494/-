package com.example.demo.controller;

import com.example.demo.bean.Insect;
import com.example.demo.mapper.InsectMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController

public class InsectController {
    @Autowired
    InsectMapper insectMapper;

    /*列出所有害虫百科*/
    @RequestMapping("get/insect/all")
    public PageInfo<Insect> getInsect(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<Insect> list=insectMapper.getInsect();
        PageInfo<Insect> pageInfo=new PageInfo<>(list);
        return pageInfo;
    }

    /*根据ch_name获取害虫百科*/
    @GetMapping("get/insect")
    public List<Insect> getInsectById(@RequestParam("ch_name") String ch_name) {
        return insectMapper.getInsectById(ch_name);
    }

    /*添加害虫百科*/
    @RequestMapping("add/insect")
    public Map<String, Object> addInsect(Insect insect, Integer id, String ch_name, String en_name, String category, String img, String cont,String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        List<Insect> result = insectMapper.getInsectById(ch_name);
        /*根据中文名判断是否存在*/
        if (result.size() == 0) {
            insectMapper.addInsect(ch_name, en_name, category, img, cont,cont_show);
            resultMap.put("code", 200);
            resultMap.put("msg", "添加害虫信息成功");
        } else {
            resultMap.put("code", 400);
            resultMap.put("msg", "添加害虫信息失败，重复添加");
        }
        return resultMap;
    }

    /*删除害虫信息*/
    @RequestMapping("del/insect")
    public Map<String, Object> delInsectById(String ch_name) {
        Map<String, Object> resultMap = new HashMap<>();
        insectMapper.delInsectById(ch_name);
        resultMap.put("code", 200);
        resultMap.put("msg", "删除害虫信息成功");
        return resultMap;
    }

    /*更新害虫百科*/
    @RequestMapping("up/insect")
    public Map<String, Object> upInsect(Integer id, String ch_name, String en_name, String category, String img, String cont ,String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        insectMapper.updateInsect(id, ch_name, en_name, category, img, cont,cont_show);
        return resultMap;
    }

    /*模糊搜索害虫信息*/
    @PostMapping("search/insect")
    public List<Insect> searchInsect(String key, String value) {
        if(key.equals("ch_name")){
            return insectMapper.searchInsectByCn(value);
        }else if(key.equals("en_name")) {
            return insectMapper.searchInsectByEn(value);
        }else if(key.equals("role")){
            return insectMapper.searchInsectByRole(value);
        }else {
            return insectMapper.searchInsectByCa(value);
        }

    }

}
