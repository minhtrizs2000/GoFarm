export function toast (parent, message){
    parent.innerHTML += 
        `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
        <strong class="mr-auto">Bootstrap</strong>
        <small class="text-muted">just now</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="toast-body">
            Add to cart success!
        </div>
    </div>`

    var close_btn = parent.querySelector(".toast .close");
    close_btn.addEventListener('click', ()=>{
        parent.querySelector(".toast").style.opacity = 0;
    })
}

