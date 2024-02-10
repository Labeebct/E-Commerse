
async function addToWish(event,productId){
    
    const wishIcon = document.querySelector(`.wish_icon${productId}`)

    event.stopPropagation()     
    event.preventDefault()

    try {

        if(wishIcon.classList.contains('bi-heart')){
            
           wishIcon.classList.replace('bi-heart','bi-heart-fill')

           const response = await fetch('/wishist/add',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({productId})
           })

           const result = await response.json()

           if(!response.ok){
            if(result.notloggedin){
                window.location.href = '/wishlist'
            }
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
    const wishCount = document.querySelector('.wish_count')


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
            if(wishCount.innerHTML == 0 ){
                document.querySelector('.cart_is_empty').style.display = 'block'
            }
         }
           else{
            console.log('Error in removing from wishlist');
           }

        
    } catch (error) {
        console.log('Error in remove from wish');
    }
}