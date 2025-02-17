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

const hours = [8, 9, 10, 11, 12];
const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

const pubSub=generatePubSub();
const componentTable = generateTable(tableContainer);
const reservationForm = generateReservationForm(modalBody, pubSub);
const navbar = generateNavbar(navbarContainer, pubSub);
const prevButton = generateButtonComponent(prevButtonContainer, pubSub) ;
const nextButton = generateButtonComponent(nextButtonContainer, pubSub) ;
const middlewareComponent= generateMiddleware();

middlewareComponent.load().then(remoteData=>{
    spinner.classList.add("d-none");
    console.log(remoteData);
    const types = remoteData.types.map(e=>e.name);

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

    componentTable.build(hours, days);
    componentTable.setData(remoteData.bookings, navbar.getCurrentCategory());
    componentTable.render();

    reservationForm.build(hours, remoteData.types);
    reservationForm.setType(navbar.getCurrentCategory());
    reservationForm.render();
    pubSub.subscribe("form-send", booking => {
        if (componentTable.add(booking)) {
            reservationForm.setStatus(true);
            componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());
            middlewareComponent.insert(booking).then(r => console.log(r));
        }
        else {
            reservationForm.setStatus(false);
        }
    });
    pubSub.subscribe("form-cancel", () => componentTable.render());

    prevButton.build('Settimana precedente', "prevButton") ;
    nextButton.build('Settimana\nsuccessiva', "nextButton") ;

    prevButton.render() ;
    pubSub.subscribe("prevButton-clicked", () => {
        componentTable.previous();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    nextButton.render() ;
    pubSub.subscribe("nextButton-clicked", () => {
        componentTable.next();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    setInterval(() => {
        reservationForm.setType(navbar.getCurrentCategory());
        spinner.classList.remove("d-none");
        middlewareComponent.load().then((r) => {
            spinner.classList.add("d-none");
            componentTable.setData(r.bookings ,navbar.getCurrentCategory())
            componentTable.render();
        });
    }, 300000);
})
