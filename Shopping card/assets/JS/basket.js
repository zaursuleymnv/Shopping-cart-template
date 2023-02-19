// let basket;

window.addEventListener('load', () => {
    basketData = getBasket()
    changeHeaderCountText()
    fillCardPage()
})

// events
let productBasket = document.querySelectorAll('.product .add-to-basket')

productBasket.forEach(e => {
    e.addEventListener('click', addToBasketEvent)
})


// functions
function addToBasketEvent() {
    let productElem = this.parentNode.parentNode.parentNode      // istədiyimiz buttonu tapmaq üçün parentlərinin sayını qeyd etməliyik. Burada 3 parent var imiş

    let product = {
        img: productElem.querySelector('img').getAttribute('src'),
        name: productElem.querySelector('.card-title').innerText,
        price: parseFloat(productElem.querySelector('.price span').innerText),
    }
    // console.log(basket);
    addProductToBasket(product)
}

function getBasket() {
    let basketData = window.localStorage.basket   // Key'i basket adında local storage yaratdım -> (localStorage.basket)

    if (basketData != undefined) {

        return JSON.parse(basketData)
    }

    basket = {
        count: 0,
        total: 0,
        products: []
    }

    return basket
}

function addProductToBasket(product) {
    let index = basketData.products.findIndex(e => e.name == product.name)  // Basketdə eyni adda product'un olub olmamasını yoxlayacaq
    console.log(index);

    if (index == -1) {
        product.qty = 1
        basketData.products.push(product)
    }
    else {
        basketData.products[index].qty ++
    }

    basketData.count ++
    basketData.total += product.price
    console.log(basketData);

    saveBasket()
    changeHeaderCountText()
}

function saveBasket() {
    localStorage.basket = JSON.stringify(basketData)    // getBasket də yaratdığımız basket massivini local storageyə əlavə edirik
}

function changeHeaderCountText() {
    document.querySelector('#total-count').innerText = basketData.count
}

function fillCardPage() {
    let cardPageSection = document.querySelector('#shopping-card')

    let cardTableBody = cardPageSection.querySelector('.table tbody')

    if(cardPageSection == null) {
        return
    }

    if (basketData.products.length == 0) {    // local storagenin daxilinin boş olub olmamasını yoxlayırıq
        alert('Your basket is empty')     // tr ni append etməzdən əvvəl yazmalıyıq
        return
    }
    
    basketData.products.forEach((e, index) => {            // ES6'nın string kimi belə bir özəlliyi varş. Hər bir elementi Create eləsək yaxşı olmazdı
        let content = `<td><img src="${e.img}" width="100"></td>                     
                  <td><h4>${e.name}</h4></td>
                  <td class="text-center"><strong>${e.qty}</strong></td>
                  <td class="text-center"><strong>${e.price} ₼</strong></td>
                  <td class="text-center"><strong>${(e.qty * e.price).toFixed(2)} ₼</strong></td>
                <td>
                    <button type="button" class="btn btn-danger remove-from-card" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>`

        let tr = document.createElement('tr')    // tr tağı yaratdım
        tr.innerHTML = content                  // və yuxarıda yaratdığım contenti tr tağının daxilinə əlavə etdim

        cardTableBody.append(tr)               // Burada isə tbody'nin daxilinə əlavə etdim
    })

    let trashButton = cardTableBody.querySelectorAll('.remove-from-card')
    
    trashButton.forEach(e => {
        e.addEventListener('click', removeFromBasket)
    })

    changeTableTotal()
}

function removeFromBasket() {
    // console.log(this.dataset.index);
    // console.log(basketData.products[this.dataset.index]);   // products massivindəki məhz seçdidiyimiz elementdi 

    basketData.count -= basketData.products[this.dataset.index].qty
    basketData.total -=  basketData.products[this.dataset.index].qty * basketData.products[this.dataset.index].price

    basketData.products.splice(this.dataset.index, 1)   // seçdiyimiz elementin özünü silir ancaq

    saveBasket()
    changeTableTotal()
    changeHeaderCountText()
    this.parentNode.parentNode.remove()

    // window.location.reload()   // Səhifəni refresh edib silməkdə olar
}

function changeTableTotal() {
    document.querySelector('#shopping-card #total-price').innerHTML = `<strong>${basketData.total.toFixed(2)} ₼</strong>`
    // cardPageSection.querySelector('#total-price').innerHTML = `<strong>${basketData.total.toFixed(2)} ₼</strong>`  // Bu işləməyəcək
}