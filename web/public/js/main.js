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
                let users = JSON.parse(server.users);
                users = users.length;
                $('main').append(`
                <div class="server_block">
                    <div class="server_title"><i id="online${k}" class="fas fa-plug"></i> ${server.server_name} [${server.id}]</div>
                    <div class="server_info">
                        <img src='${server.icon_url}' alt='Server Icon'>
                        <p>
                        Owner: ${server.owner_name}<br> 
                        OwnerID: ${server.owner_id}<br>
                        Created On: ${server.created_at}<br>
                        Region: ${server.region}<br>
                        Members: <span id="members${k}">${users}</span><br>
                        Verification Level: ${server.verification_level}
                        </p>
                    </div>
                </div>
                `);
                if (users > 75) {
                    $(`#members${k}`).css('color', 'green')
                } else if (users > 50) {
                    $(`#members${k}`).css('color', 'lightgreen')
                } else if (users > 30) {
                    $(`#members${k}`).css('color', 'yellow')
                } else if ( users > 15) {
                    $(`#members${k}`).css('color', 'orange')
                } else {
                    $(`#members${k}`).css('color', 'red')
                }


                if (server.available === 1) { // COLOR CHECKS
                    $(`#online${k}`).css('color', 'green')
                } else {
                    $(`#online${k}`).css('color', 'red')
                }            
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
    if ($(`#${page}`)) {
        $(`#${page}`).addClass('active');
    }

    if (page === 'servers') { //if page is servers
        load_servers();
    } else if (page === 'news') {
        get_news();
    }
});

