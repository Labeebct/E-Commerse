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
                addToCartBtn.innerHTML = 'GO TO CART <i class="bi bi-arrow-right-short"></i>'
            }
        }
    }
    } catch (error) {
        console.log('Error in add to cart',error.message);
    }

 }   
