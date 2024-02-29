const carTProducts = document.querySelectorAll('.product');
const placeOrderBtn = document.querySelector('.btn_div');

document.addEventListener('DOMContentLoaded',() => {
    if (carTProducts.length === 0) {
        placeOrderBtn.style.display = 'none';
    } else {
        placeOrderBtn.style.display = 'block'; 
    }
})

const cartCount = document.querySelector('.cart_count')
const addToCart = async(event,productId) => {

    event.stopPropagation()     
    event.preventDefault()

    try {
        const addToCartBtn = document.querySelector(`.addto_cart_btn${productId}`)
        const quantity = document.getElementsByName('quantity')[0]
        const cartQuantity = quantity ? quantity.value : 1

        if(addToCartBtn.innerText == 'GO TO CART'){
           return window.location.href = '/cart'
        }
        else{

        const response = await fetch('/cart/add',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId,cartQuantity})
        })

        const result = await response.json()

        if(!response.ok){
            if(result.notloggedin){
                window.location.href= '/cart'
            }
        }else{
            if(result.success){
                cartCount.innerHTML ++
                addToCartBtn.innerHTML = 'GO TO CART <i class="bi bi-arrow-right-short"></i>'
            }
        }
    }
    } catch (error) {
        console.log('Error in add to cart',error.message);
    }

 }   

 const productRemove = async(event,productId) => {

    event.stopPropagation()     
    event.preventDefault()

    const cartTotalElement = document.querySelector('.cart_total');
    const cartTotaAmount = document.querySelector('.cartTotalAmount')
    const discount = document.querySelector('.productDiscount')
    const gst = document.querySelector('.gst')
    const cartTotal = parseFloat(cartTotalElement.innerHTML);

    try {
    
        const response = await fetch('/cart/remove',{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
        })
    
        const result = await response.json()
    
        if(result.success){
          cartCount.innerHTML --
          document.querySelector('.cartCount').innerHTML--
          cartTotalElement.innerHTML = cartTotal - result.deleteProductPrice;

          discount.innerHTML = Math.round((cartTotal-result.deleteProductPrice) / 30)
          gst.innerHTML = Math.round((cartTotal-result.deleteProductPrice) / 1000)

          const discountValue = parseFloat(discount.innerHTML);
          const gstValue = parseFloat(gst.innerHTML)

          const currentAmount = Number(cartTotal-result.deleteProductPrice)

          cartTotaAmount.innerHTML = Math.round((currentAmount - discountValue)+ gstValue)
          document.querySelector(`.product${result.productId}`).remove()

          if(cartCount.innerHTML == 0 ){
            document.querySelector('.cart_is_empty').style.display = 'block'
            placeOrderBtn.style.display = 'none';
         }
         else{
            document.querySelector('.cart_is_empty').style.display = 'none'
         }
      }
        
    } catch (error) {
        console.log('Error in add to cart',error.message);
    }
}   

async function updateQuantity(event,productId){
    const quantity = event.target.value

    const cartTotalElement = document.querySelector('.cart_total');
    const cartTotaAmount = document.querySelector('.cartTotalAmount')
    const discount = document.querySelector('.productDiscount')
    const gst = document.querySelector('.gst')

    const productPrice = document.querySelector(`.new_price${productId}`)
    
    const response = await fetch(`/cart/increase_quantity?quantity=${quantity}&productId=${productId}`)
    const result = await response.json()

    const cartPriceParse = parseInt(cartTotalElement.innerHTML)
    const currentPrice = parseInt(result.currentPrice)
    const newPrice = parseInt(result.newPrice)

    if(result.success){
        const priceDiff = cartPriceParse - currentPrice + newPrice
        cartTotalElement.innerHTML = priceDiff
        productPrice.innerHTML = productPrice.innerHTML - currentPrice + newPrice

        discount.innerHTML = Math.round( (priceDiff) * .05 )
        gst.innerHTML = Math.round((priceDiff) * .01)

        const discountValue = parseFloat(discount.innerHTML);
        const gstValue = parseFloat(gst.innerHTML)

        cartTotaAmount.innerHTML = Math.round((priceDiff - discountValue)+ gstValue)
    }
}