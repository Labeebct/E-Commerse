function checkoutFromProduct(product){
    window.location.href = `/checkout?product=${product}`
}

function checkoutFromCart(cart){
    const totalPrice = document.querySelector('.cartTotalAmount').innerHTML
    window.location.href = `/checkout?cart=${cart}&totalamount=${totalPrice}`
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



function deleteFromcheckout(event,productId,productprice){

    event.stopPropagation()     
    event.preventDefault()

    const deletePrice = Number(productprice)

    const subTotal = document.querySelector('.sub_total')
    const orderTotal = document.querySelector('.order_total')

    const subTotalParse = parseFloat(subTotal.innerHTML)
    const orderTotalParse = parseFloat(orderTotal.innerHTML)
    
    const discount = Math.round(deletePrice / 30)
    const gst = Math.round(deletePrice / 1000)

    subTotal.innerHTML = (((subTotalParse - deletePrice) - gst) + discount)
    
    orderTotal.innerHTML = (((subTotalParse - deletePrice) - gst) + discount)

    document.querySelector(`.product${productId}`).remove()

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
        addressDiv.innerHTML += `<input id=add${result.arrayLength+1} name="payment" type="radio" onclick="selectAddress('${result.latestAddress._id}')"><label for="add${result.arrayLength+1}">${address}</label>`;
        newAddress.appendChild(addressDiv)
    }
}
}

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


    } catch (error) {
        console.log('Error in selectAddress',error);
    }
 }

 async function selectCoupon(couponId){

    try {
     
        const coupon = document.querySelector('.coupon')
        const subTotal = document.querySelector('.sub_total')
        const orderTotal = document.querySelector('.order_total')

    
        const subTotalParse = parseFloat(subTotal.innerHTML)
        const orderTotalParse = parseFloat(orderTotal.innerHTML)

        const response = await fetch(`/select_coupon?subTotal=${subTotalParse}&couponId=${couponId}`)
        const result = await response.json()

        const {couponDiscountPrice , discount } =result
        
        coupon.innerHTML = `-<i class="bi bi-currency-rupee"></i>${Math.round(couponDiscountPrice)}`
        coupon.classList.add('true')

        orderTotal.innerHTML = orderTotalParse - Math.round(couponDiscountPrice)
        
    } catch (error) {
        console.log('Error selectCoupon',error);
    }
 }