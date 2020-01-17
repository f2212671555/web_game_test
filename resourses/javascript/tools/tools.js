"use strict";

//get browser width
function getBrowserWidth() {
    try {
        return jQuery(window).width();
    } catch (e) {
        throw new TypeError("you should include jquery.js before tools.js","tools.js",8);
    }
}

//get browser height
function getBrowserHeight() {
    try {
        return jQuery(window).height();
    } catch (e) {
        throw new TypeError("you should include jquery.js before tools.js","tools.js",17);
    }
}

//Build Dynamic Variable
function build_dynamic_var(defineStr) {
    if (window.executeScript) {
        //IE瀏覽器
        return window.executeScript(defineStr);
    } else {
        //Chrome、Firefox等非IE瀏覽器
        return eval(defineStr);
    }
}

// Dynamic access ?Storage
function setItems(name, key, items) {
    var target = build_dynamic_var(name);
    target.setItem(key, items);
}

function getItems(name, key) {
    var target = build_dynamic_var(name);
    var data = target.getItem(key);
    console.log(data);
}

function removeItem(name, key) {
    var target = build_dynamic_var(name);
    target.removeItem(key);
}
/*
// localStorage
function setItems() {
    var aa = eval('localStorage');
    aa.setItem('key', 'value');
}

function getItems() {
    var data = localStorage.getItem('key');
    console.log(data);
}

function removeItem() {
    localStorage.removeItem('key');
}

// sessionStorage
function setItems() {
    sessionStorage.setItem('key', 'value');
}

function getItems() {
    var data = sessionStorage.getItem('key');
    console.log(data);
}

function removeItem() {
    sessionStorage.removeItem('key');
}
*/