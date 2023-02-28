package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
public class Testcontroller {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @ResponseBody
    @GetMapping("/")
    public Map<String,Object> map(){
        List<Map<String,Object>> list= jdbcTemplate.queryForList("select * FROM insect");
        return list.get(0);
    }
    @RequestMapping("/login")
    public int login(String username,String password,String cont){
        System.out.println(username);
        System.out.println(password);
        System.out.println(cont);
        return 0;
    }
}
