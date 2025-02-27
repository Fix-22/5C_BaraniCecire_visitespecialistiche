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

const isBookable = (data, booking) => { // controlla se la prenotazione in data e ora e tipo è già presente in remoto
    let bookable = true;

    data.forEach(e => {
        let d = new Date(Date.parse(booking.date));
        if (e.date.getDate() === d.getDate() && e.date.getMonth() === d.getMonth() && e.date.getFullYear() === d.getFullYear() && e.hour === booking.hour && e.type === booking.type) {
            bookable = false;
            return;
        }
    });

    return bookable;
}

middlewareComponent.load().then(remoteData=>{
    spinner.classList.add("d-none");
    console.log(remoteData)
    let types = remoteData.types.map(e=>e.name);
    let bookings = remoteData.bookings.map(e => {
        e.date = new Date(Date.parse(e.date));
        return e;
    });

    pubSub.subscribe("get-remote-data", () => {
        spinner.classList.remove("d-none");
        middlewareComponent.load().then((r) => {
            bookings = r.bookings.map(e => {
                e.date = new Date(Date.parse(e.date));
                return e;
            });
            spinner.classList.add("d-none");
            componentTable.setData(bookings);
            componentTable.setType(navbar.getCurrentCategory());
            componentTable.render();
        });
    });

    navbar.build(types);
    navbar.render();
    pubSub.subscribe("change-tab" ,category => {
        reservationForm.setType(category);
        pubSub.publish("get-remote-data"); // riscarica dati da db
    });

    componentTable.build(hours, days, bookings, navbar.getCurrentCategory());
    componentTable.render();

    reservationForm.build(hours, types);
    reservationForm.setType(navbar.getCurrentCategory());
    reservationForm.render();
    pubSub.subscribe("form-send", booking => {
        if (isBookable(bookings, booking)) {
            middlewareComponent.insert(booking).then(r => {
                reservationForm.setStatus(true);
                pubSub.publish("get-remote-data");
            });
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
        componentTable.render();
    }) ;

    nextButton.render() ;
    pubSub.subscribe("nextButton-clicked", () => {
        componentTable.next();  
        componentTable.render();
    }) ;

    setInterval(() => {
        reservationForm.setType(navbar.getCurrentCategory());
        pubSub.publish("get-remote-data");
    }, 300000);
})
