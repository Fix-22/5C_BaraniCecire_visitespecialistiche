export const generateNavbar = (parentElement, pubSub) => {
    let configuration;
    let currentCategory;

    return {
        build: (inputConfiguration) => {
            configuration = inputConfiguration;
            currentCategory = configuration[0];
        },
        render: () => {
            let html = '<div class="btn-group btn-group" data-toggle="buttons">';

            html += configuration.map(e => '<label class="btn btn-outline-secondary"' + 'id="label' + e + '">' + e + "</label>").join("") + '</div>';
            parentElement.innerHTML = html;

            document.querySelector("#label" + currentCategory).classList.add("active");

            const labels = document.querySelectorAll("label.btn");
            
            labels.forEach(l => {
                l.onclick = () => {
                    currentCategory = l.id.replace("label", "");

                    labels.forEach(e => {
                        if (e.id !== l.id){
                            e.classList.remove("active");
                        }
                        else {
                            l.classList.add("active");
                        }
                    });
                    
                    pubSub.publish("change-tab", currentCategory);
                }
            });
        },
        getCurrentCategory: () => {
            return currentCategory;
        }
    };
};