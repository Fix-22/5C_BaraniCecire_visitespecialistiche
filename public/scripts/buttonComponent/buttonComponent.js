export const generateButtonComponent = (parentElement, pubSub) => {
    let nome ;

    return {
        build : function(label) {
            nome = label ;
        },
        render : function() {
            let html = '<button type="button" id="' + nome + '" class="btn btn-info text-white actionButton ' + nome + '">' + nome + '</button>' ;

            parentElement.innerHTML = html ;

            let e = document.getElementById(nome) ;
            
            e.onclick = () => {
                pubSub.publish(e.id+"-clicked");
            }
        }
    }
}