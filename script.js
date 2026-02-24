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


