package com.example.demo.mapper;
import com.example.demo.bean.Plant;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface PlantMapper {

    /*列出所有农作物百科*/
    @Select("select * from plant")
    List<Plant> getPlant();

    /*根据农作物中文名选择*/
    @Select("select * from plant where ch_name=#{ch_name}")
    List<Plant> getPlantById(String ch_name);


    /*添加农作物信息*/
//    @Options(useGeneratedKeys = true,keyProperty = "id")
    @Insert("insert into plant(ch_name,en_name,cause,img,cont,cont_show) values(#{ch_name},#{en_name},#{cause},#{img},#{cont},#{cont_show})")
    public int addPlant(String ch_name, String en_name, String cause, String img, String cont, String cont_show);

    /*删除农作物信息*/
    @Delete("delete from plant where ch_name=#{ch_name}")
    public int delPlantById(String ch_name);


    /*更新农作物信息*/
    @Update("update plant set ch_name=#{ch_name},en_name=#{en_name},cause=#{cause},img=#{img},cont=#{cont},cont_show=#{cont_show} where id=#{id}")
    public int updatePlant(Integer id, String ch_name, String en_name, String cause, String img, String cont, String cont_show);

    /*根据中文名模糊搜索农作物信息*/
    @Select("SELECT * FROM plant WHERE ch_name LIKE CONCAT(\"%\",#{value},\"%\")")
    List<Plant> searchPlantByCn(String value);

    /*根据学名模糊搜索农作物信息*/
    @Select("SELECT * FROM plant WHERE en_name LIKE CONCAT(#{value},\"%\")")
    List<Plant> searchPlantByEn(String value);

    /*根据所属目模糊搜索农作物信息*/
    @Select("SELECT * FROM plant WHERE cause LIKE CONCAT(#{value},\"%\")")
    List<Plant> searchPlantByCa(String value);

}
