package com.example.demo.controller;

import com.example.demo.bean.Drug;
import com.example.demo.mapper.DrugMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class DrugController {

    @Autowired
    DrugMapper drugMapper;

    /*列出所有农药百科*/
    @RequestMapping("get/drug/all")
    public PageInfo<Drug> getDrug(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        List<Drug> list=drugMapper.getDrug();
        PageInfo<Drug> pageInfo=new PageInfo<>(list);
        return pageInfo;
    }

    /*根据ch_name获取农药百科*/
    @GetMapping("get/drug")
    public List<Drug> getDrugById(@RequestParam("ch_name") String ch_name) {
        return drugMapper.getDrugById(ch_name);
    }

    /*添加农药百科*/
    @RequestMapping("add/drug")
    public Map<String, Object> addDrug(Drug drug, Integer id, String ch_name, String category, String img, String cont, String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        List<Drug> result = drugMapper.getDrugById(ch_name);
        /*根据中文名判断是否存在*/
        if (result.size() == 0) {
            drugMapper.addDrug(ch_name, category, img, cont,cont_show);
            resultMap.put("code", 200);
            resultMap.put("msg", "添加农药信息成功");
        } else {
            resultMap.put("code", 400);
            resultMap.put("msg", "添加农药信息失败，重复添加");
        }
        return resultMap;
    }

    /*删除农药信息*/
    @RequestMapping("del/drug")
    public Map<String, Object> delDrugById(String ch_name) {
        Map<String, Object> resultMap = new HashMap<>();
        drugMapper.delDrugById(ch_name);
        resultMap.put("code", 200);
        resultMap.put("msg", "删除农药信息成功");
        return resultMap;
    }

    /*更新农药百科*/
    @RequestMapping("up/drug")
    public Map<String, Object> upDrug(Integer id, String ch_name, String category, String img, String cont ,String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        drugMapper.updateDrug(id, ch_name, category, img, cont,cont_show);
        return resultMap;
    }

    /*模糊搜索农药信息*/
    @PostMapping("search/drug")
    public PageInfo<Drug> searchDrug(String key, String value,int pageNum, int pageSize) {
        if(key.equals("ch_name")){
            PageHelper.startPage(pageNum,pageSize);
            List<Drug> list=drugMapper.searchDrugByCn(value);
            PageInfo<Drug> pageInfo=new PageInfo<>(list);
            return pageInfo;
        }else if(key.equals("en_name")){
            PageHelper.startPage(pageNum,pageSize);
            List<Drug> list=drugMapper.searchDrugByEn(value);
            PageInfo<Drug> pageInfo=new PageInfo<>(list);
            return pageInfo;
        }else {
            PageHelper.startPage(pageNum,pageSize);
            List<Drug> list=drugMapper.searchDrugByCa(value);
            PageInfo<Drug> pageInfo=new PageInfo<>(list);
            return pageInfo;
        }

    }
}
