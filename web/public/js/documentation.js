$(document).ready(function () {
    let nav_height = Math.round($('.main_nav').height() / $('.main_nav').parent().height() * 100)
    let body_height = Math.round($('html').height() / $('html').parent().height() * 100)
    $('.documentation').css('height', `${96.5 - body_height}%`)
    console.log(nav_height, body_height);
});