function checkoutFromProduct(product){
    window.location.href = `/checkout?product=${product}`
}

function checkoutFromCart(cart){
    window.location.href = `/checkout?cart=${cart}`
}