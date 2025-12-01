// frontend/js/script.js - VERSIÓN CORREGIDA
console.log('RedBlog cargado correctamente');

// Sistema de tema oscuro/claro
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.log('Botón de tema no encontrado');
        return;
    }
    
    // Obtener tema guardado o usar 'light' por defecto
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton(currentTheme);
    
    // Event listener para el botón de tema
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log('Cambiando tema a:', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });
}

// Actualizar icono del botón de tema
function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (theme === 'dark') {
        themeToggle.innerHTML = '☀️';
        themeToggle.title = 'Cambiar a modo claro';
    } else {
        themeToggle.innerHTML = '🌙';
        themeToggle.title = 'Cambiar a modo oscuro';
    }
}

// Sistema de votos
function initVoteSystem() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Verificar si el usuario está logueado (simulación)
            const isLoggedIn = document.querySelector('.user-welcome') !== null;
            
            if(!isLoggedIn) {
                alert('Debes iniciar sesión para votar');
                window.location.href = 'pages/login.php';
                return;
            }
            
            const voteSection = this.closest('.vote-section');
            const voteCount = voteSection.querySelector('.vote-count');
            let currentVotes = parseInt(voteCount.textContent);
            
            if(this.classList.contains('upvote')) {
                currentVotes += 1;
                this.style.color = '#059669';
                voteSection.querySelector('.downvote').style.color = '';
            } else if(this.classList.contains('downvote')) {
                currentVotes -= 1;
                this.style.color = '#dc2626';
                voteSection.querySelector('.upvote').style.color = '';
            }
            
            voteCount.textContent = currentVotes;
            
            console.log('Voto registrado:', this.classList.contains('upvote') ? 'upvote' : 'downvote');
        });
    });
}

// Navegación móvil
function initMobileMenu() {
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.className = 'mobile-menu-toggle';
    mobileMenuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;

    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        const navLinks = navContainer.querySelector('.nav-links');
        navContainer.insertBefore(mobileMenuButton, navLinks);
        
        function checkMobile() {
            if (window.innerWidth <= 768) {
                mobileMenuButton.style.display = 'block';
                navLinks.style.display = 'none';
                
                mobileMenuButton.onclick = function() {
                    const isVisible = navLinks.style.display === 'flex';
                    navLinks.style.display = isVisible ? 'none' : 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'var(--nav-bg)';
                    navLinks.style.padding = '1rem';
                    navLinks.style.gap = '1rem';
                };
            } else {
                mobileMenuButton.style.display = 'none';
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.background = 'none';
                navLinks.style.padding = '0';
            }
        }

        checkMobile();
        window.addEventListener('resize', checkMobile);
    }
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando RedBlog...');
    
    // Inicializar tema
    initTheme();
    
    // Inicializar sistema de votos
    initVoteSystem();
    
    // Inicializar menú móvil
    initMobileMenu();
    
    // Efectos hover para tarjetas
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
    
    console.log('RedBlog inicializado correctamente');
});

// Manejar errores de carga
window.addEventListener('error', function(e) {
    console.error('Error cargando la página:', e.error);
});