const wishCountTopNav = document.querySelector('.wish_count_top')
const wishCount = document.querySelector('.wish_count')
const cartCounts = document.querySelector('.cart_count')


async function addToWish(event,productId){
    
    const wishIcon = document.querySelector(`.wish_icon${productId}`)

    event.stopPropagation()     
    event.preventDefault()

    try {

        if(wishIcon.classList.contains('bi-heart')){

           const response = await fetch('/wishist/add',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
           })

           const result = await response.json()
           if(result.notloggedin){
               window.location.href = '/wishlist'
           }
           else if(result.success){
            wishCountTopNav.innerHTML++
            wishIcon.classList.replace('bi-heart','bi-heart-fill')
           }

        }
        else{
          const response = await fetch('/wishist/remove',{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
           })

           const result = await response.json()
           if(result.success){
            wishCountTopNav.innerHTML--
            wishIcon.classList.replace('bi-heart-fill','bi-heart')
         }
           else{
            console.log('Error in removing from wishlist');
           }

        }

        
    } catch (error) {
        console.log('Error in add to wish',error.message);
    }
}




async function removeFromWish(event,productId){
    
    event.stopPropagation()     
    event.preventDefault()
    
    const wishIcon = document.querySelector(`.product${productId}`)


    try {

        const response = await fetch('/wishist/remove',{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
           })

           const result = await response.json()
           if(result.success){
            wishIcon.remove()
            wishCount.innerHTML--
            wishCountTopNav.innerHTML--
            if(wishCount.innerHTML == 0 ){
                document.querySelector('.cart_is_empty').style.display = 'block'
            }
            else{
                document.querySelector('.cart_is_empty').style.display = 'none'
             }
         }
           else{
            console.log('Error in removing from wishlist');
           }

        
    } catch (error) {
        console.log('Error in remove from wish');
    }
}


async function wishToCart(event,productId){

    event.stopPropagation()     
    event.preventDefault()

    const wishIcon = document.querySelector(`.product${productId}`)
    const wishCount = document.querySelector('.wish_count')

    try {

        const response = await fetch('/wishlist/to_cart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
           })

           const result = await response.json()
           if(result.success){
            wishIcon.remove()
            wishCount.innerHTML--
            wishCountTopNav.innerHTML--
            cartCounts.innerHTML++
            if(wishCount.innerHTML == 0 ){
                document.querySelector('.cart_is_empty').style.display = 'block'
            }

        }
        
    } catch (error) {
        console.log('Error in adiing product from wish to cart');
    }
} 