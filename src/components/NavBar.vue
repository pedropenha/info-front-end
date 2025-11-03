<template>
    <div>
        <nav class="app-navbar">
            <div class="navbar-container">
                <router-link to="/" class="nav-brand">
                    <span class="text-primary-brand">INFO</span>ESTE
                </router-link>

                <button 
                    class="btn-menu-toggle" 
                    @click="toggleMenu" 
                    aria-label="Toggle navigation"
                >
                    MENU <i class="fas fa-bars"></i>
                </button>
            </div>
        </nav>

        <Transition name="slide-in-right">
            <div v-if="isMenuOpen" class="off-canvas-menu">
                <div class="menu-header">
                    <span class="nav-brand-menu">INFOESTE</span>
                    <button class="btn-close" @click="closeMenu">X</button>
                </div>

                <div class="menu-content">
                    <router-link to="/cursos" class="menu-item" @click="closeMenu">
                        Catálogo de Cursos
                    </router-link>
                    <router-link to="/perfil" class="menu-item" @click="closeMenu">
                        Meu Perfil
                    </router-link>
                    <router-link to="/sobre" class="menu-item" @click="closeMenu">
                        Sobre o Evento
                    </router-link>
                    
                    <div class="menu-spacer"></div>

                    <router-link to="/" class="menu-item btn-menu-auth" @click="closeMenu">
                        Login / Sair
                    </router-link>
                </div>
            </div>
        </Transition>

        <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
    </div>
</template>

<script>
export default {
    name: 'AppNavbar',
    data() {
        return {
            isMenuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },
    },
};
</script>

<style scoped>
/* --- Navbar Principal (Clean White) --- */
.app-navbar {
    background-color: #133328; /* Fundo branco e limpo */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave de profundidade */
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LOGO: INFO em Verde, ESTE em Dark */
.nav-brand {
    font-size: 1.8rem;
    font-weight: 800;
    text-decoration: none;
    color: #f07545; /* Cor do texto "ESTE" */
}

.text-primary-brand {
    color: white; /* Cor do texto "INFO" */
}

/* --- Botão Menu Hambúrguer (Ghost Button da Imagem) --- */
.btn-menu-toggle {
    background-color: #f07545; 
    color: white;
    border: 1px solid #f07545;
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    
    /* ESTILO DA IMAGEM: Sombra projetada */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
}

.btn-menu-toggle:hover {
    background-color: #ffc400; /* Sutilmente mais cinza no hover */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
}


/* --- Menu Off-Canvas (Menu Lateral) --- */
.off-canvas-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: white;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.15);
    z-index: 1010;
    display: flex;
    flex-direction: column;
}

.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--color-light-bg);
}

.nav-brand-menu {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark);
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
}
.btn-close:hover {
    color: #f07545;
}

.menu-content {
    display: flex;
    flex-direction: column;
    padding: 20px;
    flex-grow: 1;
}

.menu-item {
    padding: 15px 0;
    font-size: 1.1rem;
    text-decoration: none;
    color: var(--color-dark);
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s, color 0.2s;
}
.menu-item:hover {
    background-color: var(--color-light-bg);
    color: var(--color-primary);
}

.menu-spacer {
    flex-grow: 1; 
}

.btn-menu-auth {
    margin-top: 20px;
    padding: 12px 15px;
    text-align: center;
    background-color: var(--color-primary);
    color: white;
    border-radius: 4px;
    font-weight: 600;
}

/* --- Overlay e Animação --- */
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1005;
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
    transition: transform 0.3s ease;
}

.slide-in-right-enter-from,
.slide-in-right-leave-to {
    transform: translateX(100%);
}
</style>