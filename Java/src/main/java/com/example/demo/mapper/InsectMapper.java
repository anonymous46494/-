package com.example.demo.mapper;

import com.example.demo.bean.Insect;
import org.apache.ibatis.annotations.*;

import java.util.List;

//指定这是一个操作数据库的mapper
@Mapper
public interface InsectMapper {

    /*列出所有害虫百科*/
    @Select("select * from insect")
    List<Insect> getInsect();

    /*根据害虫中文名选择*/
    @Select("select * from insect where ch_name=#{ch_name}")
    List<Insect> getInsectById(String ch_name);


    /*添加害虫信息*/
//    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into insect(ch_name,en_name,category,img,cont,cont_show) values(#{ch_name},#{en_name},#{category},#{img},#{cont},#{cont_show})")
    public int addInsect(String ch_name, String en_name, String category, String img, String cont,String cont_show);

    /*删除害虫信息*/
    @Delete("delete from insect where ch_name=#{ch_name}")
    public int delInsectById(String ch_name);


    /*更新害虫信息*/
    @Update("update insect set ch_name=#{ch_name},en_name=#{en_name},category=#{category},img=#{img},cont=#{cont},cont_show=#{cont_show} where id=#{id}")
    public int updateInsect(Integer id, String ch_name, String en_name, String category, String img, String cont,String cont_show);

    /*根据中文名模糊搜索害虫信息*/
    @Select("SELECT * FROM insect WHERE ch_name LIKE CONCAT(\"%\",#{value},\"%\")")
    List<Insect> searchInsectByCn(String value);

    /*根据学名模糊搜索害虫信息*/
    @Select("SELECT * FROM insect WHERE en_name LIKE CONCAT(#{value},\"%\")")
    List<Insect> searchInsectByEn(String value);

    /*根据所属目模糊搜索害虫信息*/
    @Select("SELECT * FROM insect WHERE category LIKE CONCAT(#{value},\"%\")")
    List<Insect> searchInsectByCa(String value);

    /*根据危害类别模糊搜索害虫信息*/
    @Select("SELECT * FROM insect WHERE role LIKE CONCAT(\"%\",#{value},\"%\")")
    List<Insect> searchInsectByRole(String value);

}
