const  productOpen = (event,productId) => {
    if (event.target.closest('.addto_cart_btn')) {
          event.stopPropagation()     
          event.preventDefault()
    }
    window.location.href = `/product?product=${productId}`
}


function selectSize(event){
    event.stopPropagation()     
}
function selectQuantity(event){
    event.stopPropagation()     
}
function selectColor(event){
    event.stopPropagation()     
}