// frontend/js/script.js
console.log('RedBlog cargado correctamente');

// Funciones básicas para interactividad
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de votos (simulado por ahora)
    const voteButtons = document.querySelectorAll('.vote-btn');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Sistema de votos - Funcionalidad en desarrollo');
        });
    });

    // Navegación móvil
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    `;

    // Agregar botón móvil al navbar
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        navContainer.insertBefore(mobileMenuButton, navContainer.querySelector('.nav-links'));
    }

    // Media query para móviles
    function checkMobile() {
        if (window.innerWidth <= 768) {
            mobileMenuButton.style.display = 'block';
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = 'none';
            
            mobileMenuButton.onclick = function() {
                const isVisible = navLinks.style.display === 'flex';
                navLinks.style.display = isVisible ? 'none' : 'flex';
            };
        } else {
            mobileMenuButton.style.display = 'none';
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = 'flex';
        }
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);
});