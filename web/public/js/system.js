String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

let update_system_stats = () => {
    $.get("/data/system", 
    function (data, textStatus, jqXHR) {
        if (textStatus === 'success') {
            $(`#system_cores`).html(data.cpu.length);
            $(`#system_uptime`).html(`${data.uptime}`.toHHMMSS());
            let used_mem = data.total_mem - data.free_mem
            if (used_mem > 0.9 * data.total_mem) {
                $(`#system_memory`).css('color', 'red');
            } else if (used_mem > 0.70 * data.total_mem) {
                $(`#system_memory`).css('color', 'yellow');
            } else {
                $(`#system_memory`).css('color', 'green');
            }
            $(`#system_memory`).html((used_mem/1000000000).toFixed(2) + `  GB`);


            for (let i in data.cpu) { // Show each CPU Core Stats
                let core = data.cpu[i]
                if (!(document.getElementById(`system_core${i}`))) {
                    $(`#system_stats`).append(`<div class="system_cores" id="system_core${i}"></div>`);
                }

                document.getElementById(`system_core${i}`).innerHTML = `
                CPU CORE <b><span style="font-size:30px;">${Number(i) + 1}</span></b>
                <br><br>
                Model: ${core.model}
                <br>
                Speed: <span style="font-size:30px">${core.speed}</font>  MHz`;
            }
        }
    },
    "JSON"
    );
}

$(document).ready(() => {
    update_system_stats();
    setInterval(() => {
        update_system_stats();
    }, 1000)
    console.log('SYSTEM JS LOADED..')
})
