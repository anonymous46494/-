package com.example.demo.mapper;

import com.example.demo.bean.Drug;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DrugMapper {
    /*列出所有农药百科*/
    @Select("select * from drug")
    List<Drug> getDrug();

    /*根据农药中文名选择*/
    @Select("select * from drug where ch_name=#{ch_name}")
    List<Drug> getDrugById(String ch_name);


    /*添加农药信息*/
//    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into drug(ch_name,category,img,cont,cont_show) values(#{ch_name},#{category},#{img},#{cont},#{cont_show})")
    public int addDrug(String ch_name, String category, String img, String cont,String cont_show);

    /*删除农药信息*/
    @Delete("delete from drug where ch_name=#{ch_name}")
    public int delDrugById(String ch_name);


    /*更新农药信息*/
    @Update("update drug set ch_name=#{ch_name},category=#{category},img=#{img},cont=#{cont},cont_show=#{cont_show} where id=#{id}")
    public int updateDrug(Integer id, String ch_name, String category, String img, String cont,String cont_show);

    /*根据中文名模糊搜索农药信息*/
    @Select("SELECT * FROM drug WHERE ch_name LIKE CONCAT(\"%\",#{value},\"%\")")
    List<Drug> searchDrugByCn(String value);

    /*根据学名模糊搜索农药信息*/
    @Select("SELECT * FROM drug WHERE en_name LIKE CONCAT(#{value},\"%\")")
    List<Drug> searchDrugByEn(String value);

    /*根据所属目模糊搜索农药信息*/
    @Select("SELECT * FROM drug WHERE category LIKE CONCAT(#{value},\"%\")")
    List<Drug> searchDrugByCa(String value);
}
