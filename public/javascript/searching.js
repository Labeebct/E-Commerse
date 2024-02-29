const searchInput = document.querySelector('.search_input')
searchInput.focus()

searchInput.addEventListener('input',async(e)=>{
    try {
    
    const searchInput = document.querySelector('.search_input')
    searchValue = searchInput.value

    const response = await fetch(`/all_products/show?search=${searchValue}`)
    const result = await response.json()
    if(result.searchFilter){
    const products = result.searchFilter
    productSection.innerHTML = ''
    hideLoading()
 
    products.forEach((list) => {
        const productDiv = document.createElement('div')
        productDiv.classList.add('product_frame_grid')
        productDiv.innerHTML = `
                <div class="top">
                <button class="wish_btn wish_btn${list._id}">
                <i class="bi wish_icon${list._id} ${result.wishExist.some(product => product.productId === list._id) ? 'bi-heart-fill' : 'bi-heart'} "></i>
                </button>
                <img src="${list.productimg[0]}" style="width: 85%; height: 90%;" alt="">
                </div>
                <div class="center">
                <div class="name_div">
                <p class="product_name">${list.productname}</p>
                </div>
                <div class="price_div">
                    <p class="old_price"><i class="bi bi-currency-rupee"></i>${list.oldprice}</p>
                    <p class="new_price"><i class="bi bi-currency-rupee"></i>${list.newprice}</p>
                </div>
                </div>
                <div class="bottom"><button class="addto_cart_btn addto_cart_btn${list._id}">
                ${result.cartExist.some(product => product.productId === list._id) ? 'GO TO CART' : 'ADD TO CART'}
                <i class="bi  ${result.cartExist.some(product => product.productId === list._id) ? 'bi-arrow-right-short' : 'bi-plus-lg'}"></i>
                </button>
                </div>                     
                ` 

        productSection.appendChild(productDiv)

        productDiv.addEventListener('click',(event)=>{
            productOpen(event, list._id)
        })

        document.querySelector(`.addto_cart_btn${list._id}`).addEventListener('click',(event)=>{
            addToCart(event, list._id)
        })

        document.querySelector(`.wish_btn${list._id}`).addEventListener('click',(event)=>{
            addToWish(event, list._id)
        })
    });
}
} catch (error) {
      console.log('Error in searching',error);  
}

})

