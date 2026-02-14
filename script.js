let currentIndex = 0;
let carouselInterval;

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.gekko-image');
    const gekkoContainer = document.querySelector('.gekko');
    
    // Masquer toutes les images sauf la première
    images.forEach((img, index) => {
        img.style.display = index === 0 ? 'block' : 'none';
    });
    
    // Au survol de la souris
    gekkoContainer.addEventListener('mouseenter', function() {
        carouselInterval = setInterval(function() {
            images[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].style.display = 'block';
        }, 3000);
    });
    
    // Quand la souris quitte
    gekkoContainer.addEventListener('mouseleave', function() {
        clearInterval(carouselInterval);
        images[currentIndex].style.display = 'none';
        currentIndex = 0;
        images[0].style.display = 'block';
    });
});

function GekkoLink() {
    window.location.href = './gekko.html';
}
