const order ={
    totalamount:null,
    paymentmethode:null,
    address:null,
    coupon:null,
    products:[]
}



function checkoutFromProduct(product){
    window.location.href = `/checkout?product=${product}`
}

function checkoutFromCart(cart){
    const totalPrice = document.querySelector('.cartTotalAmount').innerHTML
    window.location.href = `/checkout?cart=${cart}`
}




const dropBtn = document.querySelector('.droup_right_btn')
const plusIcon = document.querySelector('.plus_btn')
const dropFrame = document.querySelector('.adrees_add_drop')

dropBtn.addEventListener('click',()=>{
  if(plusIcon.classList.contains('bi-plus')){
     plusIcon.classList.replace('bi-plus','bi-dash-lg')
     dropFrame.style.bottom = '3.5rem'
  }
  else{
     plusIcon.classList.replace('bi-dash-lg','bi-plus')
     dropFrame.style.bottom = '27rem'
  }

})



async function deleteFromcheckout(event,productId,productprice){

    try {
   
    event.stopPropagation()     
    event.preventDefault()

    const response = await fetch('/cart/remove',{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({productId})
    })

    const result = await response.json()

    if(result.success){

    const subTotal = document.querySelector('.sub_total')
    const orderTotal = document.querySelector('.order_total')

    const subTotalParse = parseFloat(subTotal.innerHTML)
    const orderTotalParse = parseFloat(orderTotal.innerHTML)

    const cartPrice = Number(result.cartPrice)

    document.querySelector(`.product${productId}`).remove()


    const discount = Math.round(cartPrice * .05) //calculating discount for product in cart
    const gst = Math.round(cartPrice * .01 )

    subTotal.innerHTML = ((cartPrice - discount) + gst )
    orderTotal.innerHTML = ((cartPrice - discount) + gst )
    }
     
    } catch (error) {
            console.log('Error in remove checkout',error);
    }
}


async function addNewAddress(){

    const firstName = document.getElementsByName('firstname')[1].value.trim()
    const lastName = document.getElementsByName('lastname')[1].value.trim()
    const country = document.getElementsByName('country')[1].value.trim()
    const state = document.getElementsByName('state')[1].value.trim()
    const district = document.getElementsByName('district')[1].value.trim()
    const zip = document.getElementsByName('zip')[1].value.trim()
    const address = document.getElementsByName('address')[1].value.trim()

    const errMsg = document.querySelector('.error_msg')
    const newAddress = document.querySelector('.checkouts_frame_bottom_adress')
    const form = new FormData(document.getElementById('adrress_form'))

    if(!firstName || !lastName|| !country || !state || !district || !zip|| !address ){
        errMsg.innerHTML = 'Please Fill all Fields'
        setTimeout(() => {
            errMsg.innerHTML = ''
        }, 2000);
    }
    else{
    const response = await fetch('/checkout/add_new_adress',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(Object.fromEntries(form))
    }) 

    const result = await response.json()

    if(result.success){
        errMsg.innerHTML = 'Success'
        errMsg.classList.add('true')

        setTimeout(() => {
        plusIcon.classList.replace('bi-dash-lg','bi-plus')
        dropFrame.style.bottom = '27rem'
        
        document.getElementsByName('firstname')[1].value = ''
        document.getElementsByName('lastname')[1].value = ''
        document.getElementsByName('mobilenum')[1].value = ''
        document.getElementsByName('country')[1].value = ''
        document.getElementsByName('state')[1].value = ''
        document.getElementsByName('district')[1].value = ''
        document.getElementsByName('zip')[1].value = ''
        document.getElementsByName('address')[1].value = ''

        errMsg.innerHTML = ''
    }, 200);


        const { firstname,lastname,mobilenum,country,state,district,zip,address } = result.newAddress

        document.getElementsByName('firstname')[0].value = firstname
        document.getElementsByName('mobilenum')[0].value = mobilenum
        document.getElementsByName('lastname')[0].value = lastname
        document.getElementsByName('country')[0].value = country
        document.getElementsByName('state')[0].value = state
        document.getElementsByName('district')[0].value = district
        document.getElementsByName('zip')[0].value = zip
        document.getElementsByName('address')[0].value = address
        

        const addressDiv = document.createElement('div')
        addressDiv.classList.add('payment_divs')
        addressDiv.classList.add('select_adress_div')
        addressDiv.innerHTML += `<input id=add${result.arrayLength+1} name="address" type="radio" onclick="selectAddress('${result.latestAddress._id}')"><label for="add${result.arrayLength+1}">${address}</label>`;
        newAddress.appendChild(addressDiv)
    }
}
}



 const couponUl = document.querySelector('.coupon_ul')
const emptyCoupon = document.querySelector('.empty_coupon')

if(couponUl.querySelectorAll('li').length === 0){
    emptyCoupon.style.display = 'flex'
}
else{
    emptyCoupon.style.display = 'none'
}


 async function applyCoupon(couponId){

    try {

        const coupon = document.querySelector('.coupon')
        const subTotal = document.querySelector('.sub_total')
        const orderTotal = document.querySelector('.order_total')

    
        const subTotalParse = parseFloat(subTotal.innerHTML)
        const orderTotalParse = parseFloat(orderTotal.innerHTML)

        const response = await fetch(`/apply_coupon?subTotal=${subTotalParse}&couponId=${couponId}`)
        const result = await response.json()
        if(result.success){

        const {couponDiscountPrice , discount } =result

        if(document.querySelector(`.coupon_apply${couponId}`).innerText == 'APPLY'){

        document.querySelector(`.coupon_apply${couponId}`).innerText = 'APPLIED'
            
        coupon.innerHTML = `-<i class="bi bi-currency-rupee"></i>${Math.round(couponDiscountPrice)}`
        coupon.classList.add('true')
        orderTotal.innerHTML = orderTotalParse - Math.round(couponDiscountPrice)
        order.coupon = Math.round(couponDiscountPrice)
        }
        else{
            document.querySelector(`.coupon_apply${couponId}`).innerText = 'APPLY'

            coupon.innerHTML = `Nill`
            coupon.classList.remove('true')
            orderTotal.innerHTML = orderTotalParse + Math.round(couponDiscountPrice)
            order.coupon = null
        }
    }
        
    } catch (error) {
        console.log('Error selectCoupon',error);
    }
 }



 async function selectCoupon(){
    try {

        const couponCode = document.querySelector('.coupon_input')

        const coupon = document.querySelector('.coupon')
        const orderTotal = document.querySelector('.order_total')
        const subTotal = document.querySelector('.sub_total')

        const orderTotalParse = parseFloat(orderTotal.innerHTML)
        const subTotalParse = parseFloat(subTotal.innerHTML)


        const response = await fetch(`/select_coupon?subTotal=${subTotalParse}&coponCode=${couponCode.value}`)
        const result = await response.json()

        if(!result.coupon){
            couponCode.value = 'Invalid Coupon'
            couponCode.classList.add('no_coupon')
            setTimeout(() => {
                couponCode.value = ''
                couponCode.classList.remove('no_coupon')
            }, 2000);
        }
        else{

            const { couponDiscountPrice } = result

            const selectBtn = document.querySelector('.coupon_check_btn')

         if(selectBtn.innerText ==='SELECT'){

            selectBtn.innerText = 'SELECTED'
            coupon.innerHTML = `-<i class="bi bi-currency-rupee"></i>${Math.round(couponDiscountPrice)}`
            coupon.classList.add('true')
            orderTotal.innerHTML = orderTotalParse - Math.round(couponDiscountPrice)
            order.coupon = Math.round(couponDiscountPrice)
            }
         else{
            selectBtn.innerText = 'SELECT'

            coupon.innerHTML = `Nill`
            coupon.classList.remove('true')
            orderTotal.innerHTML = orderTotalParse + Math.round(couponDiscountPrice)
            order.coupon = null
         }

    }
    } catch (error) {
        console.log('Error in select coupon',error);
    }
 }


 
 async function updateQuantity(event,productId){

    const quantity = event.target.value

    const cartTotalElement = document.querySelector('.sub_total');
    const cartTotaAmount = document.querySelector('.order_total')
    const productNewPrice = document.querySelector(`.new_price${productId}`)

    
    const response = await fetch(`/cart/increase_quantity?quantity=${quantity}&productId=${productId}`)
    const result = await response.json()

    const cartPriceParse = parseInt(result.cartPrice)
    const currentPrice = parseInt(result.currentPrice)
    const newPrice = parseInt(result.newPrice)

    const priceDiff = cartPriceParse - currentPrice + newPrice

    if(result.success){
 
        const discount = Math.round(Number(priceDiff * .05)) //calculating discount for product in cart
        const gst = Math.round(Number(priceDiff * .01))

        productNewPrice.innerHTML = newPrice
        cartTotalElement.innerHTML = Math.round((priceDiff - discount) + gst)
        cartTotaAmount.innerHTML = Math.round((priceDiff - discount) + gst)
    }   
}





// ===================== CHECKOUT ========================

const productArray = JSON.parse(document.querySelector('.productsArray').innerHTML)
const defaultAddressId = JSON.parse(document.querySelector('.defaultaddress').innerHTML)



productArray.forEach((product)=>{

    const productAmount = Number(product.quantity * product.productId.newprice)

    let products = {
        productId : product.productId._id,
        category: product.productId.category,
        quantity: product.quantity,
        color: product.productId.color[0],
        size: null,
        shipping_adress: defaultAddressId,
        payment_methode:null,
        amount: productAmount,
        status:'pending',
        order_date: new Date()
    }

    order.products.push(products)
})



function selectSize(event, size, index , productId) {
    event.preventDefault()
    event.stopPropagation();

    const label = document.querySelector('.label' + productId + index )
    const alllabel = document.querySelectorAll('.label' + productId)
    const inputCheck = document.querySelector('.radio' + productId + index );
    
    alllabel.forEach((label)=>{
        label.style.backgroundColor = '#152d35ea'
    })

    if (!inputCheck.checked) {
        label.style.backgroundColor = 'rgba(255, 0, 0, 0.886)';
    }
    
    const findProduct = order.products.find((pro)=> pro.productId == productId)
    findProduct.size = size
}



function selectQuantity(event,productId) {
    
    event.stopPropagation();  
    const productQuantity = event.target.value
    
    const findProduct = order.products.find((pro)=> pro.productId == productId)
    
    findProduct.quantity = Number(productQuantity)

}



const payment = document.querySelectorAll('.payment')
payment.forEach((item)=>{

    item.addEventListener('click',(e)=>{
     const paymentMethode = e.target.value

    order.products.forEach((pro)=>{
         pro.payment_methode = paymentMethode
    })
    order.paymentmethode = paymentMethode

 })
})        





async function selectAddress(addressId){
   
    try {
        
        const response = await fetch(`/select_address?addressId=${addressId}`)
        const result = await response.json()
   
        const { firstname,lastname,mobilenum,country,state,district,zip,address } = result.address

        document.getElementsByName('firstname')[0].value = firstname
        document.getElementsByName('mobilenum')[0].value = mobilenum
        document.getElementsByName('lastname')[0].value = lastname
        document.getElementsByName('country')[0].value = country
        document.getElementsByName('state')[0].value = state
        document.getElementsByName('district')[0].value = district
        document.getElementsByName('zip')[0].value = zip
        document.getElementsByName('address')[0].value = address

        order.products.forEach((pro)=>{
            pro.shipping_adress = addressId
       })

       order.address = addressId

    } catch (error) {
        console.log('Error in selectAddress',error);
    }
 }





async function proceed(event,addressId){
    try {
        
        const errMsg = document.querySelector('.er_msg')
        const orderTotal = document.querySelector('.order_total').innerHTML
        
        order.totalamount = Number(orderTotal)
        
        if(!order.paymentmethode){
            errMsg.innerHTML = 'Please Choose a payment Method'
            setTimeout(() => {
                errMsg.innerHTML = ''
            }, 2000);
        }
        else if(!order.address){
            order.address = addressId
        }
        else{
            
            const response = await fetch('/checkout',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({order})
            })
            
            const result = await response.json()

            if(result.success){
                window.location.href = '/summary'
            }

        }

        
        
    } catch (error) {
        console.log('Error in proceed to order summary',error);
    }
}