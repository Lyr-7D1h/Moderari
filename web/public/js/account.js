// let http_get = (path, callback) => {
//     $.get(path, 
//     function (data, textStatus, jqXHR) {
//         if (textStatus === 'success') {
//             callback(data);
//         }
//     },
//     "JSON");
//     return callback();
// }
let hide_all_pages = () => {
    $('.page').each(function (i, el) {
        $(el).css('display', 'none');
    })
}
let load_nav = () => {
    $('.account_nav').each(function (i, el) {
        $(el).on('click', () => {
            hide_all_pages();

            $('.account_nav').removeClass('active');
            $(el).addClass('active');

            let page = el.id.substr(8);
            if (page === "manage") {
                load_manage();
            }
            $(`#page_${page}`).show();

        })
    })
}
let load_manage = () => {
    console.log("LOADING MANAGE" );
    http_get("/data/roles", (data) => {
        if (data) {
            for (i in data) {
                $('#roles_content').append(`
                <div class="role"> 
                    <div class="id">${data[i].id}</div> 
                    <div class="name">${data[i].name}</div> 
                    <div class="level">${data[i].level}</div> 
                    <div class="users">${data[i].users}</div> 
                    <i data-id="${i}" class="fas fa-trash role_edit"></i>
                </div>`);
            }
            $('.role_edit').on('click', (e) => {
                let role_data = data[$(e.target).data("id")];
                alert('Deleted role "'+role_data.name+'"\nRefresh page');
                $.post( "/data/roles/delete", { id: role_data.id} );
            })
        }
    })
}
let secure_token_button = () => {
    let token = $('#secure_token').html();
    $('#secure_token').html('Click to reveal');
    $('#secure_token').on('click', (e) => {
        $('#secure_token_content').html(token);
    })
}
$(document).ready(function () {
    hide_all_pages();
    $(`#page_info`).show(); //Start with info page
    $(`#account_info`).addClass('active');

    load_nav();
    secure_token_button();
});