import {generateReservationForm} from "./scripts/formComponent/formComponent.js";
import {generateNavbar} from "./scripts/navbarComponent/navbarComponent.js";
import {generateButtonComponent} from "./scripts/buttonComponent/buttonComponent.js";
import {generateTable} from "./scripts/tableComponent/tableComponent.js";
import { generateMiddleware } from "./scripts/middlewareComponent/middlewareComponent.js";
import { generatePubSub } from "./scripts/pubSubComponent/pubSubComponent.js";

const modalBody = document.getElementById("modalBody");
const navbarContainer = document.getElementById("navbarContainer");
const tableContainer = document.getElementById("tableContainer");
const prevButtonContainer = document.getElementById("prevButtonContainer");
const nextButtonContainer = document.getElementById("nextButtonContainer");
const spinner = document.getElementById("spinner");

let confFileContent;
const hours = [8, 9, 10, 11, 12];
const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

const pubSub=generatePubSub();
const componentTable = generateTable(tableContainer);
const reservationForm = generateReservationForm(modalBody);
const navbar = generateNavbar(navbarContainer, pubSub);
const prevButton = generateButtonComponent(prevButtonContainer) ;
const nextButton = generateButtonComponent(nextButtonContainer) ;
const middlewareComponent= generateMiddleware();

middlewareComponent.load().then(remoteData=>{
    console.log(remoteData);
    const types = remoteData.types.map(e=>e.name);
    console.log(types);
    navbar.build(types);
    navbar.render();
   pubSub.subscribe("change-tab" ,category => {
        reservationForm.setType(category);
        spinner.classList.remove("d-none");
        middlewareComponent.load().then((r) => {
            spinner.classList.add("d-none");
            componentTable.setData(r.bookings ,category);
            componentTable.render();
        });
    });
    reservationForm.setType(navbar.getCurrentCategory());

    componentTable.build(hours, days);
    spinner.classList.remove("d-none");
    componenteFetch.getData("clinica").then(data => {
        spinner.classList.add("d-none");
        componentTable.setData(data, navbar.getCurrentCategory());
        componentTable.render();
    });

    reservationForm.build(hours);
    reservationForm.render();
    reservationForm.onsubmit(r => {
        if (componentTable.add(r)) {
            reservationForm.setStatus(true);
            componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());
            componenteFetch.setData("clinica", componentTable.getData()).then(r => console.log(r));
        }
        else {
            reservationForm.setStatus(false);
        }
    });
    reservationForm.oncancel(() => componentTable.render());

    prevButton.build('Settimana precedente') ;
    nextButton.build('Settimana\nsuccessiva') ;

    prevButton.render() ;
    prevButton.onsubmit(() => {
        componentTable.previous();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    nextButton.render() ;
    nextButton.onsubmit(() => {
        componentTable.next();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    setInterval(() => {
        reservationForm.setType(navbar.getCurrentCategory());
        spinner.classList.remove("d-none");
        componenteFetch.getData("clinica").then((r) => {
            spinner.classList.add("d-none");
            componentTable.setData(r ,navbar.getCurrentCategory())
            componentTable.render();
        });
    }, 300000);
})
