const addToCart = async(event,productId) => {

    event.stopPropagation()     
    event.preventDefault()

    const quantity = document.getElementsByName('quantity')[0]

    const cartQuantity = quantity ? quantity.value : 1
    
    try {

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
        }
        
    } catch (error) {
        console.log('Error in add to cart',error.message);
    }

 }   
