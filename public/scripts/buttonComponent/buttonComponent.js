export const generateButtonComponent = (parentElement, pubSub) => {
    let nome ;
    let id;

    return {
        build : function(label, inputId) {
            nome = label ;
            id=inputId;
        },
        render : function() {
            let html = '<button type="button" id="' + id + '" class="btn btn-info text-white actionButton ' + nome + '">' + nome + '</button>' ;

            parentElement.innerHTML = html ;

            let e = document.getElementById(id) ;
            
            e.onclick = () => {
                pubSub.publish(id+"-clicked");
            }
        }
    }
}