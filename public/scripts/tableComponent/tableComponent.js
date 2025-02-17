export const generateTable = (parentElement) => {
    let hours;
    let days;
    let cacheData = {};
    let currentData = {};

    let date = new Date(Date.now());

    return {
        build : (newHours, newDays) => {
            hours = newHours;
            days = newDays;
            while (date.getDay() !== 1) {
                if (date.getDay() === 6 || date.getDay() === 0) {
                    date.setDate(date.getDate() + 1);
                } else {
                    date.setDate(date.getDate() - 1);
                }
            }
        },
        render : () => {
            let html = '<table class="table table-bordered"> <thead>' ;
            let dataKeys = Object.keys(currentData);
            let dataValues = Object.values(currentData);

            //Headers
            html += "<tr><th class='table-secondary'>#</th>";
            for (let i = 0; i < days.length; i++) {
                html += "<th  class='table-secondary'>" + days[i] + "\n" + dataKeys[i*hours.length].split("-")[1] + "</th>";
            }
            html += "</tr>";
            
            //Values
            for (let h = 0; h < hours.length; h++) { // itera per ogni ora
                html += "<tr><td>" + hours[h] + "</td>";
                for (let i = 0; i < dataValues.length; i += hours.length) { // itera ogni giorno, quindi l'aumento deve essere del numero di ore
                    html += "<td>" + dataValues[i + h] + "</td>";
                }
                html += "</tr>";
            }
            
            parentElement.innerHTML = html ;
        },
        add : (reservation) => {
            if (!cacheData[Object.keys(reservation)[0]]) { //Se è presente il valore
                cacheData[Object.keys(reservation)[0]] = Object.values(reservation)[0];
                return true;
            }
            return false;
        },
        setData : (inputData, type) => {
            cacheData = inputData;
            currentData = {};

            let hold = new Date(date); // data usata per la tabella visualizzata

            for (let i = 0; i < days.length; i++) {

                for (let j = 0; j < hours.length; j++) {
                    let formatDate =  type + "-" + parseInt(hold.getDate()) + "/" + parseInt(hold.getMonth() + 1) + "/" + hold.getFullYear() + "-" + hours[j];
                    if (cacheData[formatDate]) {
                        currentData[formatDate] = cacheData[formatDate];
                    } else {
                        currentData[formatDate] = "";
                    }
                }   
                hold.setDate(hold.getDate() + 1);
                
            }
        },
        next : () => {
            date.setDate(date.getDate() + 7);
            while (date.getDay() !== 1) {
                date.setDate(date.getDate() - 1);
            }
        },
        previous : () => {
            date.setDate(date.getDate() - 7);
            while (date.getDay() !== 1) {
                date.setDate(date.getDate() - 1);
            }
        },
        getData : () => {
            return cacheData;
        }
    }
}