const prixx = {
    "8": 3.50,
    "10": 4.00,
    "13": 4.50,
    "15": 5.00
};

let currentIndex = 0;
const images = [
  "/meta/images/gecko/photo-gecko-decor.jpg",
  "/meta/images/gecko/photo-gecko-01.jpg",
  "/meta/images/gecko/photo-gecko-02.jpg",
  "/meta/images/gecko/photo-gecko-03.jpg"
];

function toggleGalerie() {
  const section = document.getElementById("galerieSection");
  const btn = document.getElementById("btnGalerie");

  section.classList.toggle("active");

  if (section.classList.contains("active")) {
    btn.innerText = "Masquer la galerie";
  } else {
    btn.innerText = "Voir la galerie";
  }
}

function openLightbox(index) {
  currentIndex = index;
  document.getElementById("lightbox-img").src = images[currentIndex];
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function changeImage(direction) {
  currentIndex += direction;

  if (currentIndex < 0) currentIndex = images.length - 1;
  if (currentIndex >= images.length) currentIndex = 0;

  document.getElementById("lightbox-img").src = images[currentIndex];
}

function showModal(title, message) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("overlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("overlay").classList.add("hidden");
}

function getPrixTotal() {
    const selectElement = document.getElementById("longueur");
    const quantiteElement = document.getElementById("quantite");
    const longueur = selectElement.value;
    const quantite = parseInt(quantiteElement.value) || 1;
    
    if (prixx[longueur]) {
        const prixProduits = prixx[longueur] * quantite;
        return prixProduits;
    }
    return 0;
}

function updateGecko() {
    const selectElement = document.getElementById("longueur");
    const quantiteElement = document.getElementById("quantite");
    const prixElement = document.getElementById("prix");

    const longueur = selectElement.value;
    const quantite = parseInt(quantiteElement.value);

    if (prixx[longueur]) {
        const prixProduits = prixx[longueur] * quantite;
        const prixTotal = prixProduits;
        prixElement.textContent = `Prix total: ${prixTotal.toFixed(2)}€ (${prixx[longueur].toFixed(2)}€ X ${quantite})`;
    } else {
        prixElement.textContent = `Prix total: 0.00€`;
    }
}

function retour() {
    document.location.href="/index.html";
}

async function commander() {
    const nom = document.getElementById("nom").value;
    const taille = document.getElementById("longueur").value;
    const quantite = document.getElementById("quantite").value;
    const adresse = document.getElementById("lieu").value;
    const email = document.getElementById("email").value;
    const cgv = document.getElementById("cgv").checked;
    const type = "gecko";

    // Validation des champs
    if (!nom || !email || !taille || !quantite || !adresse) {
        showModal("Veuillez remplir tout les champs obligatoires.");
        return;
    }

    if (!cgv) {
        showModal("Veuillez accepter les conditions générales de vente.");
        return;
    }
    
    const commanderButton = document.getElementById("order");
    const loadingGif = document.querySelector(".loading-gif");
    commanderButton.style.display = "none";
    loadingGif.style.display = "block";

    const params = new URLSearchParams();
    params.append("nom", nom);
    params.append("taille", taille);
    params.append("quantite", quantite);
    params.append("adresse", adresse);
    params.append("email", email);
    params.append("type", type);

    try {
        const response = await fetch("/api/send-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nom,
    taille,
    quantite,
    adresse,
    email,
    type
  })
});

const data = await response.json();
console.log(data);
const messageDiv = document.getElementById("messageCommande");

if (data.success) {
  showModal("Commande enregistrée", "Un email de confirmation vous a été envoyé ! Vous pouvez procédez au paiement.");
} else {
  showModal("Erreur", "Une erreur est survenue. Réessayez.");
}

        
        // Masquer le bouton Commander et afficher le bouton PayPal
        document.querySelector(".loading-gif").style.display = "none";
        document.getElementById("paypal-button-container").style.display = "block";

    } catch (error) {
        alert("Erreur réseau : " + error.message);
    }
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price, quantite, longueur, id, imageName){

if (quantite == 1) {
  showModal("Ajouté au panier", `${quantite} ${name} de ${longueur}cm a été ajouté à votre panier pour ${price.toFixed(2)}€.`);
} else {
  showModal("Ajouté au panier", `${quantite} ${name}s de ${longueur}cm ont été ajouté à votre panier pour ${price.toFixed(2)}€.`);
}

cart.push({
name:name,
price:price.toFixed(2),
quantite:quantite,
longueur:longueur,
id:id,
imageName:imageName
});

localStorage.setItem("cart", JSON.stringify(cart));
}