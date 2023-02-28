package com.example.demo.mapper;

import com.example.demo.bean.News;
import org.apache.ibatis.annotations.*;


import java.util.List;

@Mapper
public interface NewsMapper {

    /*列出所有资讯百科*/
    @Select("select * from news")
    List<News> getNews();

    /*根据资讯标题选择*/
    @Select("select * from news where title=#{title}")
    List<News> getNewsById(String title);


    /*添加资讯信息*/
//    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into news(title,author,img,status,cont,cont_show,reading,create_time) values(#{title},#{author},#{img},#{status},#{cont},#{cont_show},#{reading},#{create_time})")
    public int addNews(String title, String author, String img, String cont, String cont_show,String status, Integer reading, String create_time);

    /*删除资讯信息*/
    @Delete("delete from news where title=#{title}")
    public int delNewsById(String title);


    /*更新资讯信息*/
    @Update("update news set title=#{title},author=#{author},img=#{img},cont=#{cont},cont_show=#{cont_show},status=#{status} where id=#{id}")
    public int updateNews(Integer id, String title, String author, String img, String cont, String cont_show, String status);

    /*根据title模糊搜索资讯信息*/
    @Select("SELECT * FROM news WHERE title LIKE CONCAT(\"%\",#{value},\"%\")")
    List<News> searchNewsByTit(String value);

    /*根据status模糊搜索资讯信息*/
    @Select("SELECT * FROM news WHERE status LIKE CONCAT(#{value},\"%\")")
    List<News> searchNewsBySt(String value);
//
//    /*根据所属目模糊搜索资讯信息*/
//    @Select("SELECT * FROM news WHERE category LIKE CONCAT(#{value},\"%\")")
//    List<News> searchNewsByCa(String value);
}
