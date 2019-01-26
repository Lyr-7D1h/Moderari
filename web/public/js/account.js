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
            // console.log(page);
            $(`#page_${page}`).show();
            
        })
        // console.log(el.id);
    })
}
let sort_server_data = () => {
    let data = JSON.parse($('#user_servers').html());
    $(`#user_servers`).html('')
    for (i in data) {
        let server = data[i];
        console.log(server);
        let manageable = '';
        if (server.is_owner) {
            manageable += `<span class="tag manageable">Manageable</span>`;
        }
        console.log(manageable);
        $('#user_servers').append(`<div id="user_server_${server.server_id}" class="user_server_block">${manageable}<span class="tag verified">Verified</span><h3><b>${server.server_name} [${server.server_id}]</b></h3></div>`);
    }
    // console.log(data);
}
$(document).ready(function () {
    hide_all_pages();
    $(`#page_info`).show();
    $(`#account_info`).addClass('active');
    load_nav();
    sort_server_data();
});