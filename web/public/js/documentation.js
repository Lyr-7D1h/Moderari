var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};


let docs = []
let set_nav = () => {
    $('.doc').each((i, el) => {
        $(el).hide();

        let doc_title = $(el).find($('.doc_title'))
        let id = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())
        if (doc_title.length > 0) {
            docs.push({
                title: doc_title,
                content: $(el),
                id: el.id
            });
        } else {
            console.log('%c A DOC TITLE NOT SET', 'background: #922; color: #FFF');
            docs.push(el.id);
        }
    });
    load_nav();
    console.log(docs);
}
let load_nav = () => {
    for (i in docs) {
        let title = docs[i].title;
        let content = docs[i].content;
        let id = docs[i].id;
        $('#doc_nav').append(`
        <li id="nav_${id}">${title.text()}</li>
        `)
        $(`#nav_${id}`).on('click', (e) => {
            for (i in docs) {
                docs[i].content.hide();
            }
            content.focus();
            content.show();
        });
    }
}



$(document).ready(function () {
    // Fix documentation size
    let nav_height = Math.round($('.main_nav').height() / $('.main_nav').parent().height() * 100)
    let body_height = Math.round($('html').height() / $('html').parent().height() * 100)
    $('.documentation').css('height', `${96.5 - body_height}%`)


    // Set the nav
    set_nav();
});