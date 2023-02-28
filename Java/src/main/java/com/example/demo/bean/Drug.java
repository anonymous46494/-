package com.example.demo.bean;

public class Drug {
    private Integer id;
    private String ch_name;
    private String img;
    private String category;
    private String cont;
    private String cont_show;

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCh_name(String ch_name) {
        this.ch_name = ch_name;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setCont(String cont) {
        this.cont = cont;
    }

    public void setCont_show(String cont_show) {
        this.cont_show = cont_show;
    }

    public Integer getId() {
        return id;
    }

    public String getCh_name() {
        return ch_name;
    }

    public String getImg() {
        return img;
    }

    public String getCategory() {
        return category;
    }

    public String getCont() {
        return cont;
    }

    public String getCont_show() {
        return cont_show;
    }
}
