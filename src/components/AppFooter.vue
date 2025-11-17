<template>
    <footer class="app-footer">
        <div class="footer-container">
            
            <div class="footer-column footer-contact">
                <h4 class="footer-title text-primary">INFOESTE 2025</h4>
                <p class="footer-realizacao">Realização:</p>
                <p class="footer-item">UNOESTE - Universidade do Oeste Paulista</p>
                <p class="footer-item">FIPP - Faculdade de Informática de Presidente Prudente</p>
                
                <h4 class="footer-title mt-4">Contato / Localização</h4>
                <p class="footer-item">Bloco H - 1º andar, R. José Bongiovani, 700</p>
                <p class="footer-item">Telefone: (18) 3229 - 1060</p>
                <p class="footer-item">Email: infoeste@unoeste.br</p>
            </div>
            
            <div class="footer-column">
                <h4 class="footer-title">Navegação</h4>
                <ul>
                    <li><router-link to="/cursos" class="footer-link">Catálogo de Cursos</router-link></li>
                    <li><a href="#" class="footer-link">Ciclo de Cursos e Palestras</a></li>
                    <li><a href="#" class="footer-link">Festa Linux</a></li>
                    <li><a href="#" class="footer-link">DevFest Presidente Prudente</a></li>
                    <li><a href="#" class="footer-link">Coordenação / Organização</a></li>
                </ul>
            </div>

            <div class="footer-column footer-patrocinio">
                <h4 class="footer-title">Apoio e Parcerias</h4>
                <p>O evento conta com o apoio de grandes instituições e empresas, fundamentais para a realização da 37ª INFOESTE 2025.</p>
                <div class="logos-placeholder mt-3">
                    <span class="tag tag-primary">Patrocinador Master</span>
                    <span class="tag tag-light">Apoio UNOESTE</span>
                </div>
            </div>

        </div>
        
        <div class="footer-bottom">
            &copy; {{ new Date().getFullYear() }} INFOESTE. Desenvolvido pela FIPP/Unoeste.
        </div>
    </footer>
</template>

<script>
export default {
    name: 'AppFooter',
}
</script>

<style scoped>
.app-footer {
    background-color: var(--color-dark);
    color: white;
    padding-top: 40px;
    border-top: 5px solid var(--color-primary); 
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 40px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
}

.footer-column {
    flex: 1 1 250px;
    min-width: 200px;
}

.footer-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--color-primary); 
}

.text-primary {
    color: var(--color-primary);
}

.footer-item, .footer-realizacao {
    font-size: 0.95rem;
    margin-bottom: 8px;
    opacity: 0.8;
}


.footer-column ul {
    list-style: none;
}

.footer-link {
    display: block;
    color: white;
    text-decoration: none;
    margin-bottom: 8px;
    font-size: 0.95rem;
    transition: color 0.2s;
    opacity: 0.8;
}

.footer-link:hover {
    color: var(--color-primary);
    opacity: 1;
}


.footer-patrocinio p {
    margin-bottom: 15px;
    opacity: 0.9;
}
.logos-placeholder .tag {

    margin-right: 10px;
    margin-top: 10px;
    background-color: #555;
    color: white;
}
.tag-primary {
    background-color: var(--color-primary);
}

.footer-bottom {
    text-align: center;
    padding: 15px 20px;
    font-size: 0.85rem;
    background-color: #1a1a1a;
    opacity: 0.7;
}

@media (max-width: 768px) {
    .footer-container {
        flex-direction: column;
    }
    .footer-column {
        min-width: 100%;
        margin-bottom: 20px;
    }
    .footer-title {
        margin-top: 15px;
    }
}
</style>