/**
 * 
 * @name SimulationShopStore
 * @overview Simulation of a shop store.
 * @author Max Base
 * @date 2022-12-18
 * @version 1.0.0
 * @license GPL-3.0
 * @repository https://github.com/BaseMax/SimulationShopStore
 * 
 */

// Variables
let interval = null;
let state = "stop";
let params = {
    serving_how_many_clients_real_time: 0,
    min_client_response_time: 0,
    max_client_response_time: 0,
    ready_to_service_clients_in_queue: 0,
    queue_size: 0,
    max_simulation_clients: 0,
    min_time_to_enter_queue: 0,
    max_time_to_enter_queue: 0,
};
let clients = [];

// Elements
const elm_serving_how_many_clients_real_time = document.querySelector("#serving_how_many_clients_real_time");
const elm_min_client_response_time = document.querySelector("#min_client_response_time");
const elm_max_client_response_time = document.querySelector("#max_client_response_time");
const elm_ready_to_service_clients_in_queue = document.querySelector("#ready_to_service_clients_in_queue");
const elm_queue_size = document.querySelector("#queue_size");
const elm_max_simulation_clients = document.querySelector("#max_simulation_clients");
const elm_min_time_to_enter_queue = document.querySelector("#min_time_to_enter_queue");
const elm_max_time_to_enter_queue = document.querySelector("#max_time_to_enter_queue");
const elm_start_simulation = document.querySelector("#start_simulation");
const elm_stop_simulation = document.querySelector("#stop_simulation");

const elm_stage_count = document.querySelector("#stage-count");
const elm_queue_count = document.querySelector("#queue-count");

const elm_queue = document.querySelector(".queue");
const elm_stage = document.querySelector(".stage");

// Functions
function random_range(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function re_render() {
    // Render stage
    elm_queue.innerHTML = `<div class="queue-item queue-item-lock">
        <img src="desk.png">
    </div>`;
    const queue_clients = clients.filter(client => (client.status === "in_queue" || client.status === "in_service"));
    elm_queue_count.innerHTML = "(" + queue_clients.length + ")";
    for (let i = 0; i < queue_clients.length; i++) {
        const client = queue_clients[i];
        if (client.status === "in_service") {
            elm_queue.innerHTML += `<div class="queue-item client_in_service" data-id="${client.id}">
                <img src="man.png">
            </div>`;
        } else {
            elm_queue.innerHTML += `<div class="queue-item" data-id="${client.id}">
                <img src="man.png">
            </div>`;
        }
    }

    // Render queue
    elm_stage.innerHTML = "";
    const stage_clients = clients.filter(client => client.status == "in_stage");
    elm_stage_count.innerHTML = "(" + stage_clients.length + ")";
    for (let i = 0; i < stage_clients.length; i++) {
        const client = stage_clients[i];
        elm_stage.innerHTML += `<div class="queue-item" data-id="${client.id}">
            <img src="man.png">
        </div>`;
    }
}

function run_iteration() {
    if (clients.length == 0) return;

    const ready_clients = clients.filter(client => client.status == "in_queue");
    const service_clients = clients.filter(client => client.status == "in_service");
    const more_clients = clients.filter(client => client.status == "in_stage");

    // Check if we have more clients
    if (more_clients.length > 0) {
        console.log("We have more clients!", ready_clients.length + service_clients.length, params.queue_size);
        if ((ready_clients.length + service_clients.length) < params.queue_size) {
            more_clients[0].status = "in_queue";
        }
    }

    // Check clients
    if (ready_clients.length > 0 && service_clients.length < params.serving_how_many_clients_real_time) {
        const imax = params.serving_how_many_clients_real_time - ready_clients.length;
        for (let i = 0; i < imax; i++) {
            const client = ready_clients[i];
            console.log("Client " + client.id + " is ready to service!");
            client.status = "in_service";

            setTimeout(() => {
                client.status = "done";
                console.log("Client " + client.id + " is done!");
                clients = clients.filter(item => item.id !== client.id);
                re_render();
            }, client.time * 1000);
        }

        re_render();
    }
}

function simulation() {
    // Create `elm_max_simulation_clients` clients
    for (let i = 1; i <= params.max_simulation_clients; i++) {
        let client = {
            id: i,
            time: random_range(params.min_client_response_time, params.max_client_response_time),
            status: "in_stage",
        };
        clients.push(client);
    }

    // Create `elm_ready_to_service_clients_in_queue` clients
    for (let i = 1; i <= params.ready_to_service_clients_in_queue; i++) {
        clients[i - 1]["status"] = "in_queue";
    }

    // Start animation
    let time = 0;
    let time_random = random_range(params.min_time_to_enter_queue, params.max_time_to_enter_queue);

    const interval = setInterval(() => {
        re_render();

        if (clients.length == 0) {
            clearInterval(interval);
            state = "stop";
        }

        time += 1;
        // console.log("Time:", time, " | Time random:", time_random);
        if (time === time_random) {
            console.log("Service clients in queue and move clients from stage to queue!");
            run_iteration();
            time_random = random_range(params.min_time_to_enter_queue, params.max_time_to_enter_queue);
            time = 0;
        }
    }, 1000);
}

// Events
elm_start_simulation.addEventListener("click", () => {
    if (state == "start") {
        alert("قبلا شبیه سازی اجرا شده است!");
        return;
    }
    params = {
        serving_how_many_clients_real_time: parseInt(elm_serving_how_many_clients_real_time.value),
        min_client_response_time: parseInt(elm_min_client_response_time.value),
        max_client_response_time: parseInt(elm_max_client_response_time.value),
        ready_to_service_clients_in_queue: parseInt(elm_ready_to_service_clients_in_queue.value),
        queue_size: parseInt(elm_queue_size.value),
        max_simulation_clients: parseInt(elm_max_simulation_clients.value),
        min_time_to_enter_queue: parseInt(elm_min_time_to_enter_queue.value),
        max_time_to_enter_queue: parseInt(elm_max_time_to_enter_queue.value),
    };

    if (params.serving_how_many_clients_real_time < 0) {
        alert("تعداد افرادی که در هر لحظه می توانند خدمت شوند نمی تواند منفی باشد!");
        return;
    }
    else if (params.ready_to_service_clients_in_queue < 0) {
        alert("تعداد افراد آماده برای خدمت نمی تواند منفی باشد!");
        return;
    }
    else if (params.max_simulation_clients < 0) {
        alert("تعداد کل افراد نمی تواند منفی باشد!");
        return;
    }
    else if (params.queue_size < 0) {
        alert("اندازه صف نمی تواند منفی باشد!");
        return;
    }
    else if (params.min_client_response_time < 0) {
        alert("حداقل زمان پاسخگویی نمی تواند منفی باشد!");
        return;
    }
    else if (params.max_client_response_time < 0) {
        alert("حداکثر زمان پاسخگویی نمی تواند منفی باشد!");
        return;
    }
    else if (params.min_time_to_enter_queue < 0) {
        alert("حداقل زمان ورود به صف نمی تواند منفی باشد!");
        return;
    }
    else if (params.max_time_to_enter_queue < 0) {
        alert("حداکثر زمان ورود به صف نمی تواند منفی باشد!");
        return;
    }
    else if (params.min_client_response_time > params.max_client_response_time) {
        alert("حداقل زمان پاسخگویی بیشتر از حداکثر زمان پاسخگویی است!");
        return;
    }
    else if (params.min_time_to_enter_queue > params.max_time_to_enter_queue) {
        alert("حداقل زمان ورود به صف بیشتر از حداکثر زمان ورود به صف است!");
        return;
    }
    else if (params.serving_how_many_clients_real_time > params.queue_size) {
        alert("تعداد افرادی که در هر لحظه می توانند خدمت شوند بیشتر از اندازه صف است!");
        return;
    }
    else if (params.ready_to_service_clients_in_queue > params.max_simulation_clients) {
        alert("تعداد افراد آماده برای خدمت بیشتر از تعداد کل افراد است!");
        return;
    }
    else if (params.ready_to_service_clients_in_queue > params.elm_queue_size) {
        alert("تعداد افراد آماده برای خدمت در صف بیشتر از اندازه صف است!");
        return;
    }

    state = "start";
    console.log(params);

    simulation();
});

elm_stop_simulation.addEventListener("click", () => {
    state = "stop";
    console.log("Stop simulation!");

    elm_queue.innerHTML = `<div class="queue-item queue-item-lock">
        <img src="desk.png">
    </div>`;
    elm_stage.innerHTML = ``;

    clearInterval(interval);
});
