let hide_all_pages = () => {
    $('.page').each(function(i, el) {
        $(el).css('display', 'none');
    })
}
let load_nav = () => {
    $('.account_nav').each(function(i, el) {
        $(el).on('click', () => {
            hide_all_pages();

            $('.account_nav').removeClass('active');
            $(el).addClass('active');

            let page = el.id.substr(8);
            console.log(page);
            $(`#page_${page}`).show();
            
        })
        console.log(el.id);
    })
}

$(document).ready(function () {
    hide_all_pages();
    $(`#page_info`).show();
    $(`#account_info`).addClass('active');
    load_nav();
});