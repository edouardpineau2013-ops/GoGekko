const prixx = {
    "8": 0.50,
    "10": 0.70,
    "13": 1.00,
    "15": 1.50
};

function updateGekko() {
    const selectElement = document.getElementById("longueur");
    const quantiteElement = document.getElementById("quantite");
    const prixElement = document.getElementById("prix");

    const longueur = selectElement.value;
    const quantite = parseInt(quantiteElement.value);

    if (prixx[longueur]) {
        const prix = prixx[longueur] * quantite;
        prixElement.textContent = `Prix total: ${prix.toFixed(2)}€ (${prixx[longueur].toFixed(2)} × ${quantite})`;
    } else {
        prixElement.textContent = "Prix total: 0.00€";
    }
}

function retour() {
    window.location.href="./index.html";
}

async function commander() {
    const nom = document.getElementById("nom").value.trim();
    const taille = document.getElementById("longueur").value;
    const quantite = parseInt(document.getElementById("quantite").value);
    const adresse = document.getElementById("lieu").value.trim();
    const dateLivraison = document.getElementById("dateLivraison").value;

    if (!nom || !adresse || !dateLivraison || quantite <= 0) {
        alert("Merci de remplir tous les champs correctement.");
        return;
    }

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwOhWDl79g7Grj8MWXVd2LhnHvBgsFmrvUBwmazMGARPBMc5OzGbeCQ9IToaqcZx9s/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nom,
                taille,
                quantite,
                adresse,
                dateLivraison
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Commande enregistrée avec succès 🐉");
        } else {
            alert("Erreur lors de l'enregistrement.");
        }

    } catch (error) {
        alert("Erreur réseau : " + error.message);
    }
}


