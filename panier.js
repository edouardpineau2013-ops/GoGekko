onload = openCart;

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function openCart(){

const cartDiv = document.getElementById("cart");

let html = "";
let total = 0;

cart.forEach(item => {

html += `
<div class="cart-item">
<img src="./meta/images/${item.id}/photo-${item.imageName}-01.jpg" id="photo-produit">
<div id="details">
Type: ${item.name} | Longueur: ${item.longueur}cm | Quantité: ${item.quantite} | Prix: ${item.price}€
</div>
<div id="actions">
    <img id="trash" src="./meta/images/trash-can-solid-full.svg" alt="Supprimer" onclick="removeFromCart('${item.name}')"> 
    <img id="more" src="./meta/images/circle-plus-solid-full.svg" alt="Ajouter" onclick="moreQuantity('${item.name}', ${item.price}, ${item.quantite})"> 
    <img id="less" src="./meta/images/circle-minus-solid-full.svg" alt="Retirer" onclick="lessQuantity('${item.name}', ${item.price}, ${item.quantite})">
</div>
</div>
`;

total += parseFloat(item.price);

});

html += `<b id="total">Total : ${total.toFixed(2)}€</b>`;

cartDiv.innerHTML = html;

}

function clearCart(){

cart = [];
localStorage.removeItem("cart");

openCart();

}

function removeFromCart(name){

cart = cart.filter(item => item.name !== name);
localStorage.setItem("cart", JSON.stringify(cart));

openCart();
}

function moreQuantity(name, price, quantite){

const prixUnitaire = (parseFloat(price) / parseInt(quantite)).toFixed(2);
const item = cart.find(item => item.name === name);

if(item){
item.quantite = parseInt(item.quantite) + parseInt(1);
item.price = (parseFloat(prixUnitaire) * parseInt(item.quantite)).toFixed(2);
localStorage.setItem("cart", JSON.stringify(cart));
openCart();
}
}

function lessQuantity(name, price, quantite){

const prixUnitaire = (parseFloat(price) / parseInt(quantite)).toFixed(2);
const item = cart.find(item => item.name === name);

if(item && item.quantite > 1){
item.quantite = parseInt(item.quantite) - parseInt(1);
item.price = (parseFloat(prixUnitaire) * parseInt(item.quantite)).toFixed(2);
localStorage.setItem("cart", JSON.stringify(cart));
openCart();
} else if(item && item.quantite < 2){
removeFromCart(name, price, quantite);
}
}

function clearCart(){

cart = [];
localStorage.removeItem("cart");
openCart();
}

function retour() {
  document.location.href="/index.html";
}

if(cart.length === 0){
    document.getElementById("cart").innerHTML = "<p>Votre panier est vide</p>";
}

async function commanderCart(){

if(cart.length === 0){
alert("Votre panier est vide");
return;
}

const nom = document.getElementById("nom").value;
const email = document.getElementById("email").value;
const adresse = document.getElementById("adresse").value;

const params = new URLSearchParams();

params.append("nom", nom);
params.append("email", email);
params.append("adresse", adresse);
params.append("cart", JSON.stringify(cart));

try{

const res = await fetch("/api/send-order",{
method:"POST",
body:params
});

const data = await res.json();

alert("Commande envoyée !");

clearCart();

}catch(err){

alert("Erreur lors de la commande");
console.error(err);

}

}