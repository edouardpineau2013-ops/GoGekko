function GekkoLink() {
    window.location.href = './animaux/gekko/gekko.html';
}

function CaméléonLink() {
    window.location.href = './animaux/cameleon/cameleon.html';
}

//Barre de recherche

document.addEventListener("DOMContentLoaded", function() {

    const animals = [
        { 
            name: "gekko", 
            link: "./animaux/gekko/gekko.html",
            element: document.querySelector(".gekko")
        },
        { 
            name: "caméléon", 
            link: "./animaux/cameleon/cameleon.html",
            element: document.querySelector(".caméléon")
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
