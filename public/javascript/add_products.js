function previewImage(input) {
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}


const submitBtn = document.querySelector('.add_btn')
const errMsg = document.querySelector('.error_msg')



submitBtn.addEventListener('click',async(e) => {

    try {
        
    e.preventDefault()

    const productForm = document.querySelector('.product_form')
    const form = new FormData(productForm)


    const productName = document.getElementsByName('productname')[0].value
    const oldPrice = document.getElementsByName('oldprice')[0].value
    const newPrice = document.getElementsByName('newprice')[0].value
    const category = document.getElementsByName('category')[0].value
    const subCategory = document.getElementsByName('subcategory')[0].value
    const deliveryDate = document.getElementsByName('deliverywithin')[0].value
    const description = document.getElementsByName('description')[0].value
    const stock = document.getElementsByName('stock')[0].value
    const productImg = document.getElementsByName('productimg')[0].value

    if(!productName || !oldPrice || !newPrice || !category || !subCategory ||!deliveryDate || !description || !stock ){
        errMsg.innerHTML = 'Please Fill up all Fields'
        setTimeout(() => {
            errMsg.innerHTML = ''
        }, 2000);
    } 
    else if(!productImg){
        errMsg.innerHTML = 'Images not found'
        setTimeout(() => {
            errMsg.innerHTML = ''
        }, 2000);
    }
    else{

        console.log('hii');
        const response = await fetch('/admin/product/add_product',{
            method:'POST',
            body:form
        })

        const result = await response.json()
        

        if(!response.ok){
            throw new Error('Error in add product fetch,Product already exist')
        }
        else{

            if(result.success){
                errMsg.innerHTML = 'Product succesfully Added'
                errMsg.classList.add('success')
                setTimeout(() => {
                   window.location.href = '/admin/products'
                }, 500);     
            } 
            else{
                errMsg.innerHTML = result.ERR
                setTimeout(() => {
                   window.location.href = '/admin/product/add_product'
                }, 2000);
            }

        }


    }
} catch (error) {
    console.log('Error in add product ',error.message); 
}
    
})