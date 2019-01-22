let http_get = (path, callback) => {
    $.get(path, 
    function (data, textStatus, jqXHR) {
        if (textStatus === 'success') {
            callback(data);
        }
    },
    "JSON");
    return callback();
}
let load_servers = () => {
    http_get("/data/servers", (data) => {
    if (data) {
        for (k in data) {
            let server = data[k]
            // console.log(server);
            $('main').append(`
            <div class="server_block">
                <div class="server_title"><span style="color:rgb(31, 190, 31)">⚫</span> ${server.server_name} [${server.id}]</div>
                <div class="server_info">
                    <img src='${server.icon_url}' alt='Server Icon'>
                    <p>
                    Owner: ${server.owner}<br> 
                    OwnerID: <@${server.owner_id}><br>
                    Created On: ${server.created_at}<br>
                    Region: ${server.region}<br>
                    Members: <span style="color:yellow">${server.member_count}</span><br>
                    Verification Level: ${server.verification_level}
                    </p>
                </div>
            </div>
            `);            
        }
        load_server_buttons();
    }
    });
}
let load_server_buttons = () => {
    $('.server_title').click(function(e) { 
        // console.log($(e.target).parent().children().eq(1));
        $(e.target).parent().children().eq(1).toggle();
    })
}

// function get_news() {
//     console.log("requesting news data");
//     $.get("/data/news", 
//     function (data, textStatus, jqXHR) {
//         if (textStatus === 'success') {
//             load_news(data);
//         }
//     },
//     "JSON"
// );
// }
// function load_news(data) {
//     if (data) {
//         for (var i = data.length - 1; i >= 0; i--) {
//             let news = data[i]
//             let title = news.title;
//             let description = news.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
//             let date = news.date;
//             let categories = news.category.split(',');
//             let category_html = '';
//             for (k in categories) {
//                 let category = categories[k]
//                 console.log(category);
//                 category_html += `<div class="tag ${category.toLowerCase()}">${category}</div>`;
//             }
//             $('main').append(`
//             <div class="news_block">
//             ${category_html}
//             <div class="date">${date}</div>
//             <br>
//             <h2>${title}</h2>
//             <p>
//                 ${description}
//             </p>
//             </div>
//             `);            
//         }
//         load_buttons();
//     }
//     console.log("Server Page Loaded..")
// }

$(document).ready(function () {
    let page = document.title.toLocaleLowerCase().substr(12);
    console.log(page);
    if ($(`#${page}`)) {
        $(`#${page}`).addClass('active');
    }

    if (page === 'servers') { //if page is servers
        load_servers();
    } else if (page === 'news') {
        get_news();
    }


    console.log("JS Loaded..");
});

