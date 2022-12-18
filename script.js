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
let state = "stop";
let params = {
    min_client_response_time: 0,
    max_client_response_time: 0,
    ready_to_service_clients_in_queue: 0,
    queue_size: 0,
    max_simulation_clients: 0,
    time_to_enter_queue_first_client: 0,
    min_time_to_enter_queue: 0,
    max_time_to_enter_queue: 0,
};

// Elements
const elm_min_client_response_time = document.querySelector("#min_client_response_time");
const elm_max_client_response_time= document.querySelector("#max_client_response_time");
const elm_ready_to_service_clients_in_queue= document.querySelector("#ready_to_service_clients_in_queue");
const elm_queue_size = document.querySelector("#queue_size");
const elm_max_simulation_clients= document.querySelector("#max_simulation_clients");
const elm_time_to_enter_queue_first_client= document.querySelector("#time_to_enter_queue_first_client");
const elm_min_time_to_enter_queue= document.querySelector("#min_time_to_enter_queue");
const elm_max_time_to_enter_queue= document.querySelector("#max_time_to_enter_queue");
const elm_start_simulation = document.querySelector("#start_simulation");

// Events
elm_start_simulation.addEventListener("click", () => {
    if (state == "start") {
        alert("قبلا شبیه سازی اجرا شده است!");
        return;
    }
    params = {
        min_client_response_time: parseInt(elm_min_client_response_time.value),
        max_client_response_time: parseInt(elm_max_client_response_time.value),
        ready_to_service_clients_in_queue: parseInt(elm_ready_to_service_clients_in_queue.value),
        queue_size: parseInt(elm_queue_size.value),
        max_simulation_clients: parseInt(elm_max_simulation_clients.value),
        time_to_enter_queue_first_client: parseInt(elm_time_to_enter_queue_first_client.value),
        min_time_to_enter_queue: parseInt(elm_min_time_to_enter_queue.value),
        max_time_to_enter_queue: parseInt(elm_max_time_to_enter_queue.value),
    };

    state = "start";
    console.log(params);
});
