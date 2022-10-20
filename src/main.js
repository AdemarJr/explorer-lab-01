import "./css/index.css"
import IMask from "imask"

//Função para Alterar as Cores do CartãoPlay
const trocarCor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const trocarCor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
//Ultilizado para trocar a logo
const trocarLogo = document.querySelector(".cc-logo span:nth-child(2) img")
trocarCor01.setAttribute("fill", "green")
trocarCor02.setAttribute("fill", "blue")


//Array de cores de cartão para selecionar.
function setCardType(tipo) {
const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
}
    trocarCor01.setAttribute("fill", colors[tipo][0])
    trocarCor02.setAttribute("fill", colors[tipo][1])
    //Troca a logo do cartão atraves de interpolação
    trocarLogo.setAttribute("src", `cc-${tipo}.svg`)

}

globalThis.setCardType = setCardType

//Mascara para o CardPlay
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: "000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Mascara da Data do CardPlay

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),

        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

//Mascara do NOme do Titular

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
        mask: "0000 0000 0000 0000",
        regex: /^4\d{0,15}/,
        cardtipo:"visa",
        },
        {
        mask: "0000 0000 0000 0000",
        regex: /^5[1-5]\d{0,2}|^2[3-7]\d{0,2}\d{0,12}/,
        cardtipo:"mastercard",
        },
        {
        mask: "0000 0000 0000 0000",
        cardtipo:"default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "") 
        const mask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        return mask;
    },

}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Ação do Botão Adicionar
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
    alert("Você Adicionou seu cartão!")
})

document.querySelector("form").addEventListener("submit", (event) => {

    event.preventDefault()

})

// Altera o nome no cartão
const cardHolder = document.querySelector("#card-holder")
    cardHolder.addEventListener("input", () => {
        const ccHolder = document.querySelector(".cc-holder .value")

        ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
    })

//Altera os valores no CVC do cartão
securityCodeMasked.on("accept", () => {
    updateSecuretyCode(securityCodeMasked.value)
})
    
function updateSecuretyCode(code) {
    
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

//Altera os Valores no cartão
cardNumberMasked.on("accept", () => {
    const cardtipo = cardNumberMasked.masked.currentMask.cardtipo
    setCardType(cardtipo)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
    
    const ccNumber = document.querySelector(".cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

//Altera da Data no cartão
expirationDateMasked.on("accept", () => {
     updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
    const ccExtra = document.querySelector(".cc-expiration .value")
    ccExtra.innerText = date.length === 0 ? "02/32" : date

}
