const prixx = {
    "8": 0.50,
    "10": 0.70,
    "13": 1.00,
    "15": 1.50
};

const FRAIS_LIVRAISON = 1.50;

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
        const prixTotal = prixProduits + FRAIS_LIVRAISON;
        prixElement.textContent = `Prix total: ${prixTotal.toFixed(2)}€ (${prixx[longueur].toFixed(2)}€ X ${quantite} + ${FRAIS_LIVRAISON.toFixed(2)}€ de livraison)`;
    } else {
        prixElement.textContent = `Prix total: ${FRAIS_LIVRAISON.toFixed(2)}â‚¬ (frais de livraison)`;
    }
}

function retour() {
    window.location.href="./index.html";
}

async function commander() {
    const nom = document.getElementById("nom").value;
    const taille = document.getElementById("longueur").value;
    const quantite = document.getElementById("quantite").value;
    const adresse = document.getElementById("lieu").value;
    const email = document.getElementById("email").value;
    const cgv = document.getElementById("cgv").checked;
    const type = "Gekko";

    // Validation des champs
    if (!nom || !email || !taille || !quantite || !adresse) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    if (!cgv) {
        alert("Veuillez accepter les conditions générales de vente.");
        return;
    }

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
    email
  })
});

const data = await response.json();
console.log(data);
alert(JSON.stringify(data));


        alert("Commande enregistrée avec succès ! Vous pouvez maintenant procéder au paiement.");
        
        // Masquer le bouton Commander et afficher le bouton PayPal
        document.getElementById("order").style.display = "none";
        document.getElementById("paypal-button-container").style.display = "block";

    } catch (error) {
        alert("Erreur réseau : " + error.message);
    }
}



