<template>
  <div class="ia-recomendacao-wrapper">

    <button
      v-if="!showModal"
      class="fab"
      @click="toggleModal"
      :disabled="loading"
      aria-label="Ver Recomendações da IA"
    >
      <i class="fas fa-lightbulb"></i>
      <span v-if="loading" class="fab-text">Analisando...</span>
      <span v-else class="fab-text">Ver Recomendacoes</span>
    </button>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="toggleModal">
        <div class="modal-content">

          <button class="close-btn" @click="toggleModal">&times;</button>

          <div class="modal-header">
            <i class="fas fa-robot"></i>
            <h2>Recomendações Personalizadas</h2>
          </div>

          <div class="modal-body">

            <div v-if="loading" class="status-message loading-ia">
              <i class="fas fa-robot pulsing-icon"></i>
              <p>A Inteligência Artificial está analisando seu perfil...</p>
            </div>

            <div v-else-if="erroRecomendacao" class="status-message warning-ia">
              <i class="fas fa-exclamation-triangle"></i>
              <p>{{ erroRecomendacao }}</p>
            </div>

            <div v-else-if="recomendacoes.length > 0">
              <p class="intro-text">
                Sugestões alinhadas às suas proficiências:
              </p>
              <ul class="recomendacoes-lista">
                <li v-for="curso in recomendacoes" :key="curso._id" class="curso-item">
                  <h3 class="curso-nome">{{ curso.nome }}</h3>
                  <div class="curso-tags">
                    <span v-for="tag in curso.proficiencias" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                  <div class="explicacao-ia">
                    <i class="fas fa-lightbulb"></i>
                    <p>{{ curso.explicacao }}</p>
                  </div>
                  <button class="btn btn-primary cta" @click="inscrever(curso._id)">
                    Ver Detalhes e Inscrever-se
                  </button>
                </li>
              </ul>
            </div>

            <div v-else class="status-message warning-ia">
              <i class="fas fa-search-minus"></i>
              <p>Não encontramos recomendações no momento. Tente novamente mais tarde.</p>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "IARecomenda",
  props: {
    // Recebe a lista de recomendações do CatalogoCursos.vue
    recomendacoes: {
      type: Array,
      default: () => [],
    },
    erroRecomendacao: {
      type: String,
      default: null,
    },
    // Recebe o estado de carregamento do CatalogoCursos.vue
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;

      // Quando o modal abre E não há recomendações E não há erros prévios,
      // dispara a chamada para o método em CatalogoCursos.vue
      if (this.showModal && this.recomendacoes.length === 0 && !this.erroRecomendacao) {
        this.$emit('pedir-recomendacoes');
      }
    },
    inscrever(cursoId) {
      // Implementação da navegação para a página de detalhes do curso.
      if (cursoId) {
        // Assumindo que você usa o Vue Router:
        this.$router.push({
          name: 'detalhesCurso', // Use o nome da sua rota de detalhes
          params: { id: cursoId }
        });
        this.toggleModal(); // Fecha o modal após a navegação
      }
    }
  },
  // Adiciona o listener para fechar o modal com a tecla ESC
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showModal) {
        this.toggleModal();
      }
    });
  },
  beforeUnmount() {
    document.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showModal) {
        this.toggleModal();
      }
    });
  }
};
</script>

<style scoped>
/* ------------------------------------- */
/* --- 1. ANIMAÇÃO DE PULSO (Do Loading) --- */
/* ------------------------------------- */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* ------------------------------------- */
/* --- 2. Estilo do Botão (FAB) --- */
/* ------------------------------------- */
.ia-recomendacao-wrapper {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1001;
}

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #f07545; /* Laranja (Destaque) */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 14px 22px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease-in-out;
}

.fab:hover:not(:disabled) {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

.fab:active:not(:disabled) {
  transform: scale(1) translateY(0);
}

.fab:disabled {
  cursor: not-allowed;
  background-color: #a0a0a0;
  box-shadow: none;
}

.fab i {
  font-size: 1.2rem;
}

/* ---------------------------------- */
/* --- 3. Estilos do Modal --- */
/* ---------------------------------- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.modal-header i {
  font-size: 2rem;
  /* Cor principal (Verde escuro do seu tema) */
  color: var(--color-primary, #133328); 
  margin-right: 15px;
}

.modal-header h2 {
  font-size: 1.8rem;
  color: var(--color-dark);
}

.intro-text {
  margin-bottom: 20px;
  font-style: italic;
  color: #555;
  font-size: 1rem;
}

/* ---------------------------------- */
/* --- 4. CARD DE CURSO (ATUALIZADO) --- */
/* ---------------------------------- */
.recomendacoes-lista {
  list-style: none;
  padding: 0;
}

.curso-item {
  border: 1px solid #e0e0e0; /* Borda sutil */
  border-radius: 12px; /* Mais arredondado */
  padding: 24px; /* Mais preenchimento */
  margin-bottom: 20px; /* Mais espaçamento */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra mais suave */
  transition: all 0.3s ease;
}
.curso-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.curso-nome {
  font-size: 1.5rem; /* Título maior */
  /* Cor principal escura */
  color: var(--color-primary-dark, #133328); 
  margin-top: 0;
  margin-bottom: 15px; /* Mais espaço */
}

.explicacao-ia {
  display: flex;
  align-items: flex-start;
  background-color: #fdfaf9; /* Fundo laranja bem claro */
  border-left: 4px solid #f07545; /* Borda laranja */
  padding: 12px 15px;
  border-radius: 8px; /* Cantos arredondados */
  margin: 20px 0;
  font-size: 0.95rem;
  color: #5a4b44; /* Texto com tom de laranja/marrom */
}

.explicacao-ia i {
  color: #f07545; /* Ícone laranja */
  margin-right: 12px;
  font-size: 1.1rem;
  margin-top: 3px;
}

.explicacao-ia p {
  margin: 0;
  line-height: 1.5;
}

.curso-tags {
  margin-bottom: 15px;
}

.tag {
  display: inline-block;
  padding: 5px 12px;
  margin-right: 6px;
  margin-bottom: 6px;
  border-radius: 20px; /* Formato de pílula */
  font-size: 0.8rem;
  font-weight: 600; /* Texto mais forte */
  background-color: #eee;
  color: #333;
}
/* Pool de cores para as tags */
.tag:nth-child(4n + 1) {
  background-color: #e6f3e5; /* Verde claro (cor primária) */
  color: var(--color-primary-dark, #133328);
}
.tag:nth-child(4n + 2) {
  background-color: #fef1ec; /* Laranja claro (cor de destaque) */
  color: #f07545;
}
.tag:nth-child(4n + 3) {
  background-color: #e3f2fd; /* Azul neutro */
  color: #1976d2;
}
.tag:nth-child(4n + 4) {
  background-color: #f3eefc; /* Roxo neutro */
  color: #5a3a9b;
}


.cta {
  width: 100%;
  margin-top: 10px;
  padding: 12px; /* Mais preenchimento */
  font-weight: 600;
  font-size: 1rem;
  /* Cor primária (Verde) */
  background-color: var(--color-primary, #133328);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.cta:hover {
  background-color: var(--color-primary-dark, #0c2018);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* ---------------------------------- */
/* --- 5. ESTADOS E MENSAGENS ATUALIZADOS --- */
/* ---------------------------------- */
.status-message {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.loading-ia {
  background-color: #fff;
  border: none;
  padding: 40px 20px;
}

.loading-ia p {
  margin-top: 20px;
  font-size: 1.1rem;
  color: var(--color-dark, #333);
}

.pulsing-icon {
  font-size: 3rem;
  color: #f07545; /* Laranja */
  animation: pulse 1.5s infinite ease-in-out;
}

.warning-ia {
  background-color: #fff3e0;
  color: #ff9800;
  border: 1px solid #ffcc80;
}

/* ---------------------------------- */
/* --- 6. Transição (Animação do Modal) --- */
/* ---------------------------------- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(-20px);
}
</style>