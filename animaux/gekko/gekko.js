const prixx = {
    "8": 0.50,
    "10": 0.70,
    "13": 1.00,
    "15": 1.50
};

const FRAIS_LIVRAISON = 1.50;

let currentIndex = 0;
const images = [
  "/meta/images/gekko/photo-gekko-decor.png",
  "/meta/images/gekko/photo-gekko-01.jpg",
  "/meta/images/gekko/photo-gekko-02.jpg",
  "/meta/images/gekko/photo-gekko-03.jpg"
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
        return prixProduits + FRAIS_LIVRAISON;
    }
    return FRAIS_LIVRAISON;
}

function updateGekko() {
    const selectElement = document.getElementById("longueur");
    const quantiteElement = document.getElementById("quantite");
    const prixElement = document.getElementById("prix");

    const longueur = selectElement.value;
    const quantite = parseInt(quantiteElement.value);

    if (prixx[longueur]) {
        const prixProduits = prixx[longueur] * quantite;
        const prixSansTaxe = prixProduits + FRAIS_LIVRAISON;
        const prixTotal = prixSansTaxe + 0.30 + (1.2/100 * prixSansTaxe);
        prixElement.textContent = `Prix total: ${prixTotal.toFixed(2)}€ (${prixx[longueur].toFixed(2)}€ X ${quantite} + ${FRAIS_LIVRAISON.toFixed(2)}€ de livraison + taxes paypal)`;
    } else {
        prixElement.textContent = `Prix total: ${FRAIS_LIVRAISON.toFixed(2)}€ (frais de livraison)`;
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
    const type = "gekko";

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