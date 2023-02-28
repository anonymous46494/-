package com.example.demo.bean;

public class Plant {
    private Integer id;
    private String ch_name;
    private String en_name;
    private String img;
    private String role;
    private String cause;
    private String cont;
    private String cont_show;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCh_name(String ch_name) {
        this.ch_name = ch_name;
    }

    public void setEn_name(String en_name) {
        this.en_name = en_name;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public void setCause(String cause) {
        this.cause = cause;
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

    public String getEn_name() {
        return en_name;
    }

    public String getImg() {
        return img;
    }

    public String getCause() {
        return cause;
    }

    public String getCont() {
        return cont;
    }

    public String getCont_show() {
        return cont_show;
    }
}
