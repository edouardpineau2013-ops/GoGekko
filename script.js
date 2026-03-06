onload = loadReviews;

function showModal(title, message) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("overlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("overlay").classList.add("hidden");
}

function GeckoLink() {
    window.location.href = './animaux/gecko/gecko.html';
}

function CaméléonLink() {
    window.location.href = './animaux/cameleon/cameleon.html';
}

function PoulpeLink() {
    window.location.href = './animaux/poulpe/poulpe.html';
}

function RequinLink() {
    window.location.href = './animaux/requin/requin.html';
}

function SerpentLink() {
    window.location.href = './animaux/serpent/serpent.html';
}

function DragonLink() {
    window.location.href = './animaux/dragon/dragon.html';
}

function HippocampeLink() {
    window.location.href = './animaux/hippocampe/hippocampe.html';
}

//Barre de recherche

document.addEventListener("DOMContentLoaded", function() {

    const animals = [
        { 
            name: "gecko", 
            link: "./animaux/gecko/gecko.html",
            element: document.querySelector(".gecko")
        },
        { 
            name: "caméléon", 
            link: "./animaux/cameleon/cameleon.html",
            element: document.querySelector(".caméléon")
        },
        { 
            name: "poulpe", 
            link: "./animaux/poulpe/poulpe.html",
            element: document.querySelector(".poulpe")
        },
        { 
            name: "requin",
            link: "./animaux/requin/requin.html",
            element: document.querySelector(".requin")
        },
        { 
            name: "serpent",
            link: "./animaux/serpent/serpent.html",
            element: document.querySelector(".serpent")
        },
        { 
            name: "dragon",
            link: "./animaux/dragon/dragon.html",
            element: document.querySelector(".dragon")
        },
        { 
            name: "hippocampe",
            link: "./animaux/hippocampe/hippocampe.html",
            element: document.querySelector(".hippocampe")
        }
    ];

    const searchBar = document.getElementById("searchBar");
    const suggestionsBox = document.getElementById("suggestions");

    function normalizeText(text) {
        return text.toLowerCase()
                   .normalize("NFD")
                   .replace(/[\u0300-\u036f]/g, "");
    }

    searchBar.addEventListener("input", function() {

        const value = normalizeText(this.value);
        suggestionsBox.innerHTML = "";

        animals.forEach(animal => {
            const match = normalizeText(animal.name).includes(value);

            if (value === "" || match) {
                animal.element.classList.remove("hidden");
            } else {
                animal.element.classList.add("hidden");
            }
        });

        if (!value) {
            suggestionsBox.classList.remove("active");
            return;
        }

        const results = animals.filter(a =>
            normalizeText(a.name).includes(value)
        );

        if (results.length === 0) {
            suggestionsBox.classList.remove("active");
            return;
        }

        results.forEach(a => {
            const div = document.createElement("div");
            div.textContent = a.name;

            div.addEventListener("click", function() {
                window.location.href = a.link;
            });

            suggestionsBox.appendChild(div);
        });

        suggestionsBox.classList.add("active");
    });

    document.addEventListener("click", function(e) {
        if (!e.target.closest(".search-container")) {
            suggestionsBox.classList.remove("active");
        }
    });

});

let rating = 0;

const stars = document.querySelectorAll("#stars img");

stars.forEach(star => {

  star.addEventListener("click", () => {

    rating = star.dataset.value;

    stars.forEach(s => {
      if (s.dataset.value <= rating) {
        s.src = "./meta/images/star-solid-full.svg";
      } else {
        s.src = "./meta/images/star-regular-full.svg";
      }
    });

  });

});

function star1() {
    rating = 1;
}

function star2() {
    rating = 2;
}

function star3() {
    rating = 3;
}

function star4() {
    rating = 4;
}

function star5() {
    rating = 5;
}

async function sendReview() {

const name = document.getElementById("reviewName").value;
const message = document.getElementById("reviewMessage").value;

if (!name || !message || rating === 0) {
    showModal("Erreur 😬", "Veuillez remplir tous les champs et sélectionner une note.");
    return;
} else {
    await addDoc(collection(db, "reviews"), {
    name: name,
    message: message,
    rating: rating,
    date: Date.now()
    });
}

loadReviews();

}

async function loadReviews() {

const snapshot = await getDocs(collection(db, "reviews"));

const container = document.getElementById("reviews");
container.innerHTML = "";

let totalRating = 0;
let count = 0;

snapshot.forEach(doc => {

const data = doc.data();

totalRating += Number(data.rating);
count++;

container.innerHTML += `
<div class="review">
<div class="review-name"><strong>Nom: ${data.name}</strong></div>
<div class="review-rating">Note: ${"⭐".repeat(data.rating)}</div>
<p class="review-message">Avis: ${data.message}</p>
</div>
`;

});

if (count > 0) {

const average = (totalRating / count).toFixed(1);

document.getElementById("averageRating").textContent = `${"⭐".repeat(average)} | ${average}`;
document.getElementById("reviewCount").textContent = count;

}

}

loadReviews();