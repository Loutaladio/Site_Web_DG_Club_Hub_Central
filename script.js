document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Scroll animations (fade-in effect)
    const sections = document.querySelectorAll("section");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Placeholder content for tutorials (example)
    const tutorielGrid = document.querySelector(".tutoriel-grid");
    const tutorials = [
        {
            title: "Introduction au Développement Web",
            description: "Apprenez les bases de HTML, CSS et JavaScript pour créer vos premières pages web.",
            image: "https://via.placeholder.com/300x200/007AFF/FFFFFF?text=Web+Dev"
        },
        {
            title: "Maîtriser React.js",
            description: "Plongez dans le monde de React pour construire des interfaces utilisateur dynamiques et performantes.",
            image: "https://via.placeholder.com/300x200/FF3B30/FFFFFF?text=React.js"
        },
        {
            title: "Sécurité Réseau pour Débutants",
            description: "Comprenez les fondamentaux de la cybersécurité pour protéger vos applications et vos données.",
            image: "https://via.placeholder.com/300x200/FFD700/000000?text=Cybersecurity"
        }
    ];

    tutorials.forEach(tutorial => {
        const item = document.createElement("div");
        item.classList.add("grid-item");
        item.innerHTML = `
            <img src="${tutorial.image}" alt="${tutorial.title}">
            <h3>${tutorial.title}</h3>
            <p>${tutorial.description}</p>
        `;
        tutorielGrid.appendChild(item);
    });

    // Placeholder content for books (example)
    const bookGrid = document.querySelector(".book-grid");
    const books = [
        {
            title: "Guide Ultime d'Orientation et de Réussite en Génie Informatique",
            author: "Danick Arcel Loutaladio",
            description: "Le guide complet pour les étudiants en informatique au Congo-Brazzaville.",
            image: "https://via.placeholder.com/300x400/007AFF/FFFFFF?text=Livre+Info"
        },
        {
            title: "Ma Trajectoire Réseau",
            author: "Divine Oubourra",
            description: "Un ouvrage sur le parcours et les compétences en réseaux et cybersécurité.",
            image: "https://via.placeholder.com/300x400/FF3B30/FFFFFF?text=Livre+Reseau"
        }
    ];

    books.forEach(book => {
        const item = document.createElement("div");
        item.classList.add("grid-item");
        item.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>Auteur: ${book.author}</p>
            <p>${book.description}</p>
        `;
        bookGrid.appendChild(item);
    });
});
