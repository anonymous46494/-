package com.example.demo.mapper;

import com.example.demo.bean.Teach;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TeachMapper {
    /*列出所有种植攻略百科*/
    @Select("select * from teach")
    List<Teach> getTeach();

    /*根据种植攻略标题选择*/
    @Select("select * from teach where title=#{title}")
    List<Teach> getTeachById(String title);


    /*添加种植攻略信息*/
    @Insert("insert into teach(title,author,img,status,cont,cont_show,reading,create_time) values(#{title},#{author},#{img},#{status},#{cont},#{cont_show},#{reading},#{create_time})")
    public int addTeach(String title, String author, String img, String cont, String cont_show,String status, Integer reading, String create_time);

    /*删除种植攻略信息*/
    @Delete("delete from teach where title=#{title}")
    public int delTeachById(String title);


    /*更新种植攻略信息*/
    @Update("update teach set title=#{title},author=#{author},img=#{img},cont=#{cont},cont_show=#{cont_show},status=#{status} where id=#{id}")
    public int updateTeach(Integer id, String title, String author, String img, String cont, String cont_show, String status);

    /*根据title模糊搜索种植攻略信息*/
    @Select("SELECT * FROM teach WHERE title LIKE CONCAT(\"%\",#{value},\"%\")")
    List<Teach> searchTeachByTit(String value);

    /*根据status模糊搜索种植攻略信息*/
    @Select("SELECT * FROM teach WHERE status LIKE CONCAT(#{value},\"%\")")
    List<Teach> searchTeachBySt(String value);
}
