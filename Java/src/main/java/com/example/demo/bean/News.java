package com.example.demo.bean;

public class News {
    private Integer id;
    private String title;
    private String author;
    private Integer reading;
    private String create_time;
    private String img;
    private String cont;
    private String cont_show;
    private String status;

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setReading(Integer reading) {
        this.reading = reading;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public void setImg(String img) {
        this.img = img;
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

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public Integer getReading() {
        return reading;
    }

    public String getCreate_time() {
        return create_time;
    }

    public String getImg() {
        return img;
    }

    public String getCont() {
        return cont;
    }

    public String getCont_show() {
        return cont_show;
    }
}
