package com.example.demo.controller;

import com.example.demo.bean.Plant;
import com.example.demo.mapper.PlantMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@Controller
public class PlantController {

    @Autowired
    PlantMapper plantMapper;

    /*列出所有害虫百科*/
    @RequestMapping("get/plant/all")
    public PageInfo<Plant> getInsect(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Plant> list = plantMapper.getPlant();
        PageInfo<Plant> pageInfo = new PageInfo<>(list);
        return pageInfo;
    }

    /*根据ch_name获取害虫百科*/
    @GetMapping("get/plant")
    public List<Plant> getPlantById(@RequestParam("ch_name") String ch_name) {
        return plantMapper.getPlantById(ch_name);
    }

    /*添加害虫百科*/
    @RequestMapping("add/plant")
    public Map<String, Object> addPlant(Plant plant, Integer id, String ch_name, String en_name, String cause, String img, String cont, String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        List<Plant> result = plantMapper.getPlantById(ch_name);
        /*根据中文名判断是否存在*/
        if (result.size() == 0) {
            plantMapper.addPlant(ch_name, en_name, cause, img, cont,cont_show);
            resultMap.put("code", 200);
            resultMap.put("msg", "添加害虫信息成功");
        } else {
            resultMap.put("code", 400);
            resultMap.put("msg", "添加害虫信息失败，重复添加");
        }
        return resultMap;
    }

    /*删除害虫信息*/
    @RequestMapping("del/plant")
    public Map<String, Object> delPlantById(String ch_name) {
        Map<String, Object> resultMap = new HashMap<>();
        plantMapper.delPlantById(ch_name);
        resultMap.put("code", 200);
        resultMap.put("msg", "删除害虫信息成功");
        return resultMap;
    }

    /*更新害虫百科*/
    @RequestMapping("up/plant")
    public Map<String, Object> upPlant(Integer id, String ch_name, String en_name, String cause, String img, String cont, String cont_show) {
        Map<String, Object> resultMap = new HashMap<>();
        plantMapper.updatePlant(id, ch_name, en_name, cause, img, cont,cont_show);

        return resultMap;
    }

    /*模糊搜索害虫信息*/
    @PostMapping("search/plant")
    public List<Plant> searchPlant(String key, String value) {
        if(key.equals("ch_name")){
            return plantMapper.searchPlantByCn(value);
        }else if(key.equals("en_name")){
            return plantMapper.searchPlantByEn(value);
        }else {
            return plantMapper.searchPlantByCa(value);
        }

    }

}
