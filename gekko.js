let stripe;
let elements;

// Initialiser Stripe (Remplacez par votre clé publique Stripe)
const stripePublicKey = "pk_test_51Sy8qQJG4OMEsccffm1DQLUo4LOxg7pj80MGsX3JdktYHOlKsVvFhqryhA1YdNTyUPdK0fakOxjXICezxHktjbuM00ZMTQzZKG";

function updateGekko() {
    const selectElement = document.getElementById("longueur");
    const quantiteElement = document.getElementById("quantite");
    const assuranceElement = document.getElementById("assurance");
    const selectedSize = selectElement.value;
    const quantite = parseInt(quantiteElement.value) || 1;
    const assurance = assuranceElement.checked ? 1.00 : 0;
    const prix = document.getElementById("prix");
    
    const prices = {
        "8": 0.30,
        "10": 0.40,
        "13": 0.70,
        "15": 1.00
    };
    
    if (prices[selectedSize]) {
        const prixUnitaire = prices[selectedSize];
        const prixSansAssurance = (prixUnitaire * quantite);
        const prixTotal = (prixSansAssurance + assurance).toFixed(2);
        
        let detailAssurance = assurance > 0 ? ` + 1,00€ (assurance)` : '';
        prix.innerHTML = `Prix : ${prixTotal.replace('.', ',')}€ (${prixUnitaire.toFixed(2).replace('.', ',')}€ × ${quantite}${detailAssurance})`;
    }
}

// Initialiser Stripe au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    stripe = Stripe(stripePublicKey);
    elements = stripe.elements();
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
    updateGekko();
});

// Fonction de paiement
async function handlePayment() {
    const selectElement = document.getElementById("longueur");
    const quantiteElement = document.getElementById("quantite");
    const assuranceElement = document.getElementById("assurance");
    const selectedSize = selectElement.value;
    const quantite = parseInt(quantiteElement.value) || 1;
    const assurance = assuranceElement.checked ? 1.00 : 0;
    
    const prices = {
        "8": 0.30,
        "10": 0.40,
        "13": 0.70,
        "15": 1.00
    };
    
    const prixUnitaire = prices[selectedSize];
    const prixSansAssurance = (prixUnitaire * quantite);
    const prixTotal = Math.round((prixSansAssurance + assurance) * 100); // Montant en centimes
    
    const submitBtn = document.getElementById("submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Traitement...";
    
    try {
        // Créer un PaymentIntent (vous devez avoir un backend pour cela)
        const response = await fetch("/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: prixTotal,
                size: selectedSize,
                quantity: quantite,
                insurance: assurance
            })
        });
        
        const data = await response.json();
        const clientSecret = data.clientSecret;
        
        // Confirmer le paiement
        const result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: window.location.href + "?success=true"
            }
        });
        
        if (result.error) {
            showMessage(result.error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = "Payer maintenant";
        }
    } catch (error) {
        showMessage("Erreur lors du paiement: " + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Payer maintenant";
    }
}

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;
}

function retour() {
    window.location.href="./index.html";
}

