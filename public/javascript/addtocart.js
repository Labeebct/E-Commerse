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
          gst.innerHTML = (cartTotal-result.deleteProductPrice) / 1000

          const discountValue = parseFloat(discount.innerHTML);
          const gstValue = parseFloat(gst.innerHTML)

          const currentAmount = Number(cartTotal-result.deleteProductPrice)

          cartTotaAmount.innerHTML = Math.round((currentAmount - discountValue)+ gstValue)
          document.querySelector(`.product${result.productId}`).remove()

          if(cartCount.innerHTML == 0 ){
            document.querySelector('.cart_is_empty').style.display = 'block'
         }
         else{
            document.querySelector('.cart_is_empty').style.display = 'none'
         }
        }
        
    } catch (error) {
        console.log('Error in add to cart',error.message);
    }
    
    }   
