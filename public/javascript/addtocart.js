

const notLoggedScreen = document.querySelector('.login_to_view')

const addToCart = async(event,productId) => {

    event.stopPropagation()     
    event.preventDefault()
    
    try {

        const response = await fetch('/cart/add',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
        })

        const result = await response.json()

        if(!response.ok){
            if(result.notloggedin){
                window.location.href= '/cart'
            }
            throw new Error('Error in adding to cart')
        }else{
 
        }
        
    } catch (error) {
        console.log('Error in add to cart',error.message);
    }

 }   
