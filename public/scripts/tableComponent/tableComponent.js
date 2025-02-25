export const generateTable = (parentElement) => {
    let hours;
    let days;
    let cacheData;
    let type;

    let date = new Date(Date.now());

    return {
        build : (newHours, newDays, inputCacheData, inputType) => {
            hours = newHours;
            days = newDays;
            cacheData = inputCacheData;
            type = inputType;
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
            let tempDate = new Date(date);

            //Headers
            html += "<tr><th class='table-secondary'>#</th>";
            for (let i = 0; i < days.length; i++) {
                html += "<th  class='table-secondary'>" + days[i] + "\n" + tempDate.toLocaleString("it-IT").split(",")[0] + "</th>";
                tempDate.setDate(tempDate.getDate() + 1);
            }
            html += "</tr>";
            
            //Values
            for (let h = 0; h < hours.length; h++) { // itera per ogni ora
                tempDate = new Date(date);
                html += "<tr><td>" + hours[h] + "</td>";
                
                for (let d = 0; d < days.length; d++) {
                    let foundedBooking = cacheData.find(e => e.hour === hours[h] && e.type === type && e.date.getDate() === tempDate.getDate() && e.date.getMonth() === tempDate.getMonth() && e.date.getFullYear() === tempDate.getFullYear()); // cerca nell'array di dizionari con tutte le prenotazioni
                    html += "<td>" + (foundedBooking !== undefined ? foundedBooking.name : "") + "</td>";
                    tempDate.setDate(tempDate.getDate() + 1);
                }
                html += "</tr>";
            }
            
            parentElement.innerHTML = html ;
        },
        setData : (inputData) => {
            cacheData = inputData;
        },
        setType : (inputType) => {
            type = inputType;
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