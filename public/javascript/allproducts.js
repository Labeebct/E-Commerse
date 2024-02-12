let currentValue = 0

const productSection = document.querySelector('.product_section')


async function fetchProducts(){
    const response = await fetch(`/all_products/show?page=${currentValue}`)
    const result = await response.json()
    productSection.innerHTML = ''
    hideLoading()
    const products = result.products
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
                    <p class="old_price"><i class="bi bi-currency-rupee"></i>${list.oldprice.toLocaleString()}</p>
                    <p class="new_price"><i class="bi bi-currency-rupee"></i>${list.newprice.toLocaleString()}</p>
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




const pagesBtn = document.getElementsByClassName('page_btn')


async function  active(){
    for(l of pagesBtn){

        l.classList.remove('active_link')
    }

    event.target.classList.add('active_link')
    currentValue = event.target.value
    showLoading()
    fetchProducts()

}



async function prev(){
    if(currentValue > 1){
        for(l of pagesBtn){

     l.classList.remove('active_link')
   }   

   currentValue--;
   pagesBtn[currentValue-1].classList.add('active_link')
   showLoading()
   fetchProducts()


    }
}

async function next(){
    if(currentValue < 50 ){
        for(l of pagesBtn){

   l.classList.remove('active_link')
   }   
   
   currentValue++;
   pagesBtn[currentValue-1].classList.add('active_link')
   showLoading()
   fetchProducts()

  }
}



const loadingScreen = document.querySelector('.loading_screen')

const showLoading = ()=> loadingScreen.style.display = 'flex'
const hideLoading = ()=> loadingScreen.style.display = 'none'



document.addEventListener('DOMContentLoaded', async()=>{
      try {
        showLoading()
        fetchProducts()        

      } catch (error) {
        console.log('Error in all product fetch');
      }
})





// --------------------------------------------------------------------------





async function filterProducts(filterBase,filter){
    showLoading()
    const response = await fetch(`/all_products/show?f=${filterBase}&filter=${filter}`)
    const result = await response.json()
    productSection.innerHTML = ''
    hideLoading()
    const products = result.filterProducts

    console.log(products);
 
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
                    <p class="old_price"><i class="bi bi-currency-rupee"></i>${list.oldprice.toLocaleString()}</p>
                    <p class="new_price"><i class="bi bi-currency-rupee"></i>${list.newprice.toLocaleString()}</p>
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








const catRadio = document.querySelectorAll('.input_cat')
const priceRadio = document.querySelectorAll('.input_price')
const colorRadio = document.querySelectorAll('.input_color')



catRadio.forEach((button)=>{
    button.addEventListener('click',async(e)=>{
        try {
           const filterBase = 'CATEGORY'
           const filter =  e.target.value
           showLoading()
           filterProducts(filterBase,filter)
        
       } catch (error) {
        
       }

    })
})

priceRadio.forEach((button)=>{
    button.addEventListener('click',async(e)=>{
        try {
           const filterBase = 'PRICE'
           const filter =  e.target.value
           showLoading()
           filterProducts(filterBase,filter)
        
       } catch (error) {
        
       }

    })
})


colorRadio.forEach((button)=>{
    button.addEventListener('click',async(e)=>{
        try {
           const filterBase = 'COLOR'
           const filter =  e.target.value
           showLoading()
           filterProducts(filterBase,filter)
        
       } catch (error) {
        
       }

    })
})