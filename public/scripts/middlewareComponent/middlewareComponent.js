export const generateMiddleware=()=>{
    return{
        load: ()=>{
            try {
                return new Promise((resolve, reject) => {
                    fetch("/bookings").then(r => r.json()).then(data => {
                        resolve(data);
                    }).catch(err => {
                        reject(err);
                    })
                });
            }
            catch (e) {
                console.error(e);
            }
        },

        delete: (id) =>{
            try {
                return new Promise((resolve, reject) => {
                    fetch("/delete/"+id, {
                        method: "delete",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(r => r.json()).then(data => {
                        return resolve(data);
                    }).catch(err => {
                        reject(err);
                    })
                });
            }
            catch (e) {
                console.error(e);
            }
        },
        insert: (booking) => {
            const body = booking;
            const fetchOptions = {
                method: 'post',
                body: body
            };

            try {
                return new Promise((resolve, reject) => {
                    fetch("/insert", fetchOptions).then(r => r.json()).then(data => {
                        resolve(data);
                    }).catch(err => {
                        reject(err);
                    })
                });   
            } catch (e) {
                console.error(e);
            }
        }
    }
}
