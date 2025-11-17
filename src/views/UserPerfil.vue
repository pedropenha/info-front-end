<template>
  <div class="perfil-page">
    <div class="perfil-container">
      <h1 class="page-title">Meu Perfil</h1>

      <div v-if="loading" class="loading-message">
        Carregando dados...
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="perfil-grid">
        <div class="perfil-foto-section">
          <div class="foto-container">
            <div class="foto-wrapper">
              <img
                :src="userData.foto || defaultAvatar"
                alt="Foto do perfil"
                class="foto-perfil"
              />
              <div class="foto-overlay">
                <iconify-icon icon="hugeicons:camera-01" width="48" height="48"></iconify-icon>
              </div>
            </div>
            
            <div class="foto-actions">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*"
                style="display: none"
              />
              <button
                class="btn-change-photo"
                @click="$refs.fileInput.click()"
                :disabled="saving"
              >
                <iconify-icon icon="hugeicons:upload-02" width="20" height="20"></iconify-icon> Alterar Foto
              </button>
              <button
                v-if="userData.foto"
                class="btn-remove-photo"
                @click="removeFoto"
                :disabled="saving"
              >
                <iconify-icon icon="hugeicons:delete-02" width="20" height="20"></iconify-icon> Remover Foto
              </button>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <iconify-icon icon="hugeicons:user-circle" width="32" height="32"></iconify-icon>
              <div>
                <span class="stat-label">Nível</span>
                <span class="stat-value">{{ userData.nivel }}</span>
              </div>
            </div>
            <div class="stat-item">
              <iconify-icon icon="hugeicons:calendar-03" width="32" height="32"></iconify-icon>
              <div>
                <span class="stat-label">Membro desde</span>
                <span class="stat-value">{{ formatDate(userData.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="perfil-form-section">
          <div class="form-card">
            <h3 class="section-title">Informações Pessoais</h3>
            <form @submit.prevent="handleUpdate">
              <div class="form-group">
                <label for="nome" class="form-label">
                  <iconify-icon icon="hugeicons:user" width="20" height="20"></iconify-icon> Nome Completo
                </label>
                <input
                  v-model="formData.nome"
                  type="text"
                  id="nome"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="email" class="form-label">
                  <iconify-icon icon="hugeicons:mail-01" width="20" height="20"></iconify-icon> E-mail
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  id="email"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="cpf" class="form-label">
                  <iconify-icon icon="hugeicons:identification" width="20" height="20"></iconify-icon> CPF
                </label>
                <input
                  v-model="userData.cpf"
                  type="text"
                  id="cpf"
                  class="form-input"
                  disabled
                />
                <small class="form-hint">O CPF não pode ser alterado</small>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <iconify-icon icon="hugeicons:stars" width="20" height="20"></iconify-icon> Proficiências
                </label>
                <div class="proficiencias-container">
                  <div class="proficiencia-input-group">
                    <input
                      v-model="novaProficiencia"
                      type="text"
                      class="form-input"
                      placeholder="Ex: JavaScript, Python, React..."
                      @keypress.enter.prevent="adicionarProficiencia"
                    />
                    <button
                      type="button"
                      class="btn-add-proficiencia"
                      @click="adicionarProficiencia"
                    >
                      <iconify-icon icon="hugeicons:add-circle" width="24" height="24"></iconify-icon>
                    </button>
                  </div>
                  
                  <div v-if="formData.proficiencias && formData.proficiencias.length > 0" class="proficiencias-tags">
                    <div
                      v-for="(prof, index) in formData.proficiencias"
                      :key="index"
                      class="proficiencia-tag"
                    >
                      <span>{{ prof }}</span>
                      <button
                        type="button"
                        class="btn-remove-tag"
                        @click="removerProficiencia(index)"
                      >
                        <iconify-icon icon="hugeicons:cancel-01" width="16" height="16"></iconify-icon>
                      </button>
                    </div>
                  </div>
                  <small class="form-hint">Adicione suas habilidades e tecnologias que você domina</small>
                </div>
              </div>
              
              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-save"
                  :disabled="saving"
                >
                  <iconify-icon icon="hugeicons:tick-02" width="20" height="20"></iconify-icon>
                  <span v-if="!saving">Salvar Alterações</span>
                  <span v-else>Salvando...</span>
                </button>
                <button
                  type="button"
                  class="btn-cancel"
                  @click="cancelEdit"
                  :disabled="saving"
                >
                  <iconify-icon icon="hugeicons:cancel-01" width="20" height="20"></iconify-icon> Cancelar
                </button>
              </div>
            </form>
          </div>

          <div class="form-card">
            <h3 class="section-title">Meus Cursos</h3>
            
            <div v-if="loadingCursos" class="loading-message-small">
              Carregando cursos...
            </div>

            <h4 class="subsection-title">Cursos Atuais</h4>
            <div v-if="cursosAtuais.length > 0" class="meus-cursos-list">
              <div v-for="inscricao in cursosAtuais" :key="inscricao._id" class="curso-card">
                <div class="curso-info">
                  <span class="curso-nome">{{ inscricao.cursoId.nome }}</span>
                  
                  <div class="curso-instrutores">
                    <span class="label-instrutores">Instrutor(es):</span>
                    <div class="instrutores-list">
                      <div 
                        v-for="instrutor in (Array.isArray(inscricao.cursoId.instrutores) ? inscricao.cursoId.instrutores : [])" 
                        :key="typeof instrutor === 'object' ? instrutor._id : instrutor"
                        class="instrutor-item-small"
                      >
                        <img 
                          v-if="typeof instrutor === 'object' && instrutor.nome"
                          :src="instrutor.foto || `https://ui-avatars.com/api/?name=${instrutor.nome}&background=4e9e47&color=fff`" 
                          :alt="instrutor.nome"
                          class="instrutor-avatar-tiny"
                        />
                        <span class="instrutor-nome-small">
                          {{ typeof instrutor === 'object' && instrutor.nome ? instrutor.nome : instrutor }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <span
                    :class="['curso-status', inscricao.status.toLowerCase().replace(' ', '-')]"
                  >
                    Status: {{ inscricao.status }}
                  </span>
                </div>
                <div class="curso-actions">
                  <button
                    class="btn-desinscrever"
                    @click="abrirModalConfirmacao(inscricao._id)"
                    :disabled="saving"
                  >
                    <iconify-icon icon="hugeicons:cancel-01" width="18" height="18"></iconify-icon>
                    Desinscrever
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="!loadingCursos" class="info-box info-box-neutral">
              <iconify-icon icon="hugeicons:info-circle" width="32" height="32"></iconify-icon>
              <div>
                <span class="stat-value">Você não está em nenhum curso no momento.</span>
                <p>Explore o catálogo para encontrar sua próxima oportunidade!</p>
              </div>
            </div>
            
            <h4 class="subsection-title">Histórico de Cursos</h4>
            <div v-if="cursosHistorico.length > 0" class="meus-cursos-list">
              <div v-for="inscricao in cursosHistorico" :key="inscricao._id" class="curso-card curso-card-historico">
                <div class="curso-info">
                  <span class="curso-nome">{{ inscricao.cursoId.nome }}</span>
                  
                  <div class="curso-instrutores">
                    <span class="label-instrutores">Instrutor(es):</span>
                    <div class="instrutores-list">
                      <div 
                        v-for="instrutor in (Array.isArray(inscricao.cursoId.instrutores) ? inscricao.cursoId.instrutores : [])" 
                        :key="typeof instrutor === 'object' ? instrutor._id : instrutor"
                        class="instrutor-item-small"
                      >
                        <img 
                          v-if="typeof instrutor === 'object' && instrutor.nome"
                          :src="instrutor.foto || `https://ui-avatars.com/api/?name=${instrutor.nome}&background=4e9e47&color=fff`" 
                          :alt="instrutor.nome"
                          class="instrutor-avatar-tiny"
                        />
                        <span class="instrutor-nome-small">
                          {{ typeof instrutor === 'object' && instrutor.nome ? instrutor.nome : instrutor }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <span
                    :class="['curso-status', inscricao.status.toLowerCase().replace(' ', '-')]"
                  >
                    Status: {{ inscricao.status }}
                  </span>
                </div>
                
                <div class="curso-actions" v-if="inscricao.status === 'Concluido'">
                  <div v-if="inscricao.avaliacao" class="avaliacao-realizada">
                    <div class="avaliacao-info">
                      <span class="avaliacao-label">Sua avaliação:</span>
                      <div class="stars-display">
                        <iconify-icon 
                          v-for="star in 5" 
                          :key="star"
                          icon="hugeicons:star"
                          width="20"
                          height="20"
                          :class="star <= inscricao.avaliacao.nota ? 'star-filled' : 'star-empty'"
                        ></iconify-icon>
                      </div>
                    </div>
                  </div>
                  <button 
                    v-else
                    class="btn-avaliar"
                    @click="abrirModalAvaliacaoHistorico(inscricao)"
                  >
                    <iconify-icon icon="hugeicons:star" width="20" height="20"></iconify-icon>
                    Avaliar Curso
                  </button>
                </div>
              </div>
            </div>
            <div v-else-if="!loadingCursos" class="info-box info-box-neutral">
              <iconify-icon icon="hugeicons:archive" width="32" height="32"></iconify-icon>
              <div>
                <span class="stat-value">Nenhum curso no seu histórico.</span>
              </div>
            </div>

          </div>
          </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="fecharModalConfirmacao">
        <div class="confirm-modal-content">
          <h3 class="modal-title">Confirmar Cancelamento</h3>
          <p class="modal-text">Você tem certeza de que deseja cancelar sua inscrição neste curso? Esta ação não pode ser desfeita.</p>
          <div class="modal-actions">
            <button class="btn-cancel-modal" @click="fecharModalConfirmacao" :disabled="saving">
              Voltar
            </button>
            <button class="btn-confirm-delete" @click="confirmarCancelamento" :disabled="saving">
              <span v-if="!saving">Sim, cancelar inscrição</span>
              <span v-else>Cancelando...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Avaliação -->
    <transition name="modal-fade">
      <div v-if="showAvaliacaoModal" class="confirm-modal-overlay" @click.self="fecharModalAvaliacao">
        <div class="confirm-modal-content modal-avaliacao">
          <h3 class="modal-title">Avaliar Curso</h3>
          <p class="modal-subtitle">{{ cursoParaAvaliar?.cursoId?.nome }}</p>
          
          <div class="avaliacao-form">
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="hugeicons:star" width="20" height="20"></iconify-icon>
                Classificação
              </label>
              <div class="stars-rating">
                <iconify-icon 
                  v-for="star in 5" 
                  :key="star"
                  icon="hugeicons:star"
                  width="32"
                  height="32"
                  :class="['star', { 'star-filled': star <= avaliacaoForm.nota }]"
                  @click="avaliacaoForm.nota = star"
                ></iconify-icon>
              </div>
              <span class="rating-label">{{ avaliacaoForm.nota }} de 5 estrelas</span>
            </div>

            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="hugeicons:message-02" width="20" height="20"></iconify-icon>
                Comentário (Opcional)
              </label>
              <textarea 
                v-model="avaliacaoForm.comentario"
                class="form-textarea"
                rows="4"
                placeholder="Compartilhe sua experiência com este curso..."
                maxlength="500"
              ></textarea>
              <span class="char-count">{{ avaliacaoForm.comentario.length }}/500</span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel-modal" @click="fecharModalAvaliacao" :disabled="saving">
              Cancelar
            </button>
            <button 
              class="btn-confirm-submit" 
              @click="enviarAvaliacao" 
              :disabled="saving || avaliacaoForm.nota === 0"
            >
              <span v-if="!saving">
                <iconify-icon icon="hugeicons:tick-02" width="20" height="20"></iconify-icon>
                Enviar Avaliação
              </span>
              <span v-else>Enviando...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "UserPerfil",
  data() {
    return {
      userData: {
        id: '',
        _id: '',
        nome: '',
        email: '',
        cpf: '',
        nivel: '',
        foto: null,
        createdAt: ''
      },
      formData: {
        nome: '',
        email: '',
        foto: null,
        proficiencias: []
      },
    
      meusCursos: [],
      loadingCursos: true,
      
    
      showConfirmModal: false,
      inscricaoParaCancelar: null,

 
      showAvaliacaoModal: false,
      cursoParaAvaliar: null,
      avaliacaoForm: {
        nota: 0,
        comentario: ''
      },

      novaProficiencia: '',
      defaultAvatar: 'https://via.placeholder.com/300x300/4e9e47/ffffff?text=Sem+Foto',
      loading: true,
      saving: false,
      error: '',
      errorMessage: '',
      successMessage: '',
      selectedFile: null
    };
  },
  
  computed: {
    cursosAtuais() {
      return this.meusCursos.filter(insc =>
        insc.status === 'Inscrito' || insc.status === 'Fila de Espera'
      );
    },
    cursosHistorico() {
      return this.meusCursos.filter(insc =>
        insc.status === 'Concluido' || insc.status === 'Cancelado'
      );
    }
  },

  async mounted() {
    await this.loadUserData();
    if (this.userData._id) {
      this.loadMeusCursos();
    }
  },
  methods: {
    loadUserData() {
      return new Promise((resolve, reject) => {
        const user = localStorage.getItem('user');
        if (!user) {
          this.$router.push('/');
          return reject(new Error("Usuário não logado."));
        }
        try {
          const userData = JSON.parse(user);
          this.userData = { ...userData };
          this.formData.nome = userData.nome;
          this.formData.email = userData.email;
          this.formData.foto = userData.foto;
          this.formData.proficiencias = userData.proficiencias || [];
          this.loading = false;
          resolve();
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          this.error = 'Erro ao carregar dados do usuário';
          this.loading = false;
          reject(error);
        }
      });
    },

    async loadMeusCursos() {
      this.loadingCursos = true;
      const userId = this.userData._id || this.userData.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}/inscricoes`);
        this.meusCursos = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar seus cursos inscritos.";
        console.error("Erro ao carregar cursos:", error);
      } finally {
        this.loadingCursos = false;
      }
    },

    abrirModalConfirmacao(inscricaoId) {
      this.inscricaoParaCancelar = inscricaoId;
      this.showConfirmModal = true;
    },
    fecharModalConfirmacao() {
      this.showConfirmModal = false;
      this.inscricaoParaCancelar = null;
    },
    abrirModalAvaliacaoHistorico(inscricao) {
      this.cursoParaAvaliar = inscricao;
      this.avaliacaoForm.nota = 0;
      this.avaliacaoForm.comentario = '';
      this.showAvaliacaoModal = true;
    },
    fecharModalAvaliacao() {
      this.showAvaliacaoModal = false;
      this.cursoParaAvaliar = null;
      this.avaliacaoForm.nota = 0;
      this.avaliacaoForm.comentario = '';
    },
    async enviarAvaliacao() {
      if (this.avaliacaoForm.nota === 0) {
        alert('Por favor, selecione uma classificação de 1 a 5 estrelas.');
        return;
      }

      this.saving = true;
      this.clearMessages();

      try {
        const userId = this.userData._id || this.userData.id;
        const cursoId = this.cursoParaAvaliar.cursoId._id;

        await axios.post('http://localhost:3000/api/avaliacoes', {
          usuarioId: userId,
          cursoId: cursoId,
          nota: this.avaliacaoForm.nota,
          comentario: this.avaliacaoForm.comentario
        });

        this.successMessage = 'Avaliação enviada com sucesso!';
        this.flashMessage('success');
        this.fecharModalAvaliacao();
        
        
        await this.loadMeusCursos();
      } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        this.errorMessage = error.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.';
        this.flashMessage('error');
      } finally {
        this.saving = false;
      }
    },
    async confirmarCancelamento() {
      this.saving = true;
      this.clearMessages();
      const inscricaoId = this.inscricaoParaCancelar;

      try {
        await axios.delete(`http://localhost:3000/api/inscricoes/${inscricaoId}`);
        this.meusCursos = this.meusCursos.filter(inscricao => inscricao._id !== inscricaoId);
        this.successMessage = "Inscrição cancelada com sucesso!";
        this.flashMessage('success');
      } catch (error) {
        this.errorMessage = "Erro ao cancelar inscrição. Tente novamente.";
        this.flashMessage('error');
        console.error("Erro ao desinscrever:", error);
      } finally {
        this.saving = false;
        this.fecharModalConfirmacao();
      }
    },
    
    
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    flashMessage(type) {
      setTimeout(() => {
        if (type === 'success') this.successMessage = '';
        if (type === 'error') this.errorMessage = '';
      }, 3000);
    },

    
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          this.errorMessage = 'Por favor, selecione um arquivo de imagem válido';
          this.flashMessage('error');
          return;
        }
        if (file.size > 5 * 1024 * 1024) { 
          this.errorMessage = 'A imagem deve ter no máximo 5MB';
          this.flashMessage('error');
          return;
        }
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.foto = e.target.result;
          this.userData.foto = e.target.result;
        };
        reader.readAsDataURL(file);
        this.errorMessage = '';
      }
    },

    async removeFoto() {
      if (!confirm("Tem certeza de que deseja remover sua foto de perfil?")) {
        return;
      }
      this.saving = true;
      this.clearMessages();
      try {
        const userId = this.userData._id || this.userData.id;
        const updateData = { foto: null };
        const response = await axios.put(
          `http://localhost:3000/api/users/${userId}`,
          updateData
        );
        const updatedUser = { ...this.userData, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        this.userData.foto = null;
        this.formData.foto = null;
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
        
        window.dispatchEvent(new Event('storage'));
        this.successMessage = "Foto removida com sucesso!";
        this.flashMessage('success');
      } catch (error) {
        console.error('Erro ao remover foto:', error);
        this.errorMessage = "Não foi possível remover a foto. Tente novamente.";
        this.flashMessage('error');
      } finally {
        this.saving = false;
      }
    },

    adicionarProficiencia() {
      if (this.novaProficiencia.trim()) {
        if (!this.formData.proficiencias.includes(this.novaProficiencia.trim())) {
          this.formData.proficiencias.push(this.novaProficiencia.trim());
          this.novaProficiencia = '';
        } else {
          this.errorMessage = 'Esta proficiência já foi adicionada';
          this.flashMessage('error');
        }
      }
    },

    removerProficiencia(index) {
      this.formData.proficiencias.splice(index, 1);
    },

    async handleUpdate() {
      this.clearMessages();
      this.saving = true;
      try {
        const userId = this.userData._id || this.userData.id;
        if (!userId) {
          this.errorMessage = 'ID do usuário não encontrado. Faça login novamente.';
          this.saving = false;
          return;
        }

        const updateData = {
          nome: this.formData.nome,
          email: this.formData.email,
          foto: this.formData.foto, 
          proficiencias: this.formData.proficiencias
        };
        const response = await axios.put(
          `http://localhost:3000/api/users/${userId}`,
          updateData
        );
        const updatedUser = { ...this.userData, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
        this.successMessage = 'Perfil atualizado com sucesso!';
        
        this.selectedFile = null; 
        this.$refs.fileInput.value = '';

        setTimeout(() => {
          this.loadUserData();
          this.successMessage = '';
        }, 2000);
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        if (error.response) {
          this.errorMessage = error.response.data.message || 'Erro ao atualizar perfil';
        } else {
          this.errorMessage = 'Erro ao conectar com o servidor';
        }
      } finally {
        this.saving = false;
      }
    },

    cancelEdit() {
      this.loadUserData();
      this.clearMessages();
      this.selectedFile = null;
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    }
  }
};
</script>

<style scoped>
.perfil-page {
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
}
.perfil-container {
  max-width: 1400px;
  margin: 0 auto;
}
.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #133328;
  margin-bottom: 2rem;
}
.loading-message {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.perfil-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .perfil-grid {
    grid-template-columns: 350px 1fr;
  }
}
.perfil-foto-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-self: start;
}

.foto-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.foto-wrapper {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease;
}
.foto-wrapper:hover {
  transform: scale(1.05);
}
.foto-wrapper:hover .foto-overlay {
  opacity: 1;
}
.foto-perfil {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.foto-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.foto-overlay iconify-icon {
  color: white;
}
.foto-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
}
.btn-change-photo,
.btn-remove-photo {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-change-photo {
  background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
  color: white;
}
.btn-change-photo:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
}
.btn-remove-photo {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}
.btn-remove-photo:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}
.btn-change-photo:disabled,
.btn-remove-photo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}
.stat-item iconify-icon {
  color: #4e9e47;
}
.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
}
.stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
}


.perfil-form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #133328;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
.form-label iconify-icon {
  color: #4e9e47;
}
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafafa;
}
.form-input:focus {
  outline: none;
  border-color: #4e9e47;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(78, 158, 71, 0.1);
}
.form-input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  color: #6c757d;
}
.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}

.proficiencias-container {
  margin-top: 0.5rem;
}
.proficiencia-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.proficiencia-input-group .form-input {
  flex: 1;
  margin-bottom: 0;
}
.btn-add-proficiencia {
  padding: 0.75rem;
  background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-add-proficiencia:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
}
.proficiencias-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.proficiencia-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(78, 158, 71, 0.3);
  transition: all 0.3s ease;
}
.proficiencia-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
}
.btn-remove-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}
.btn-remove-tag:hover {
  background: rgba(255, 255, 255, 0.4);
}
.btn-remove-tag iconify-icon {
  color: white;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
@media (min-width: 768px) {
  .form-actions {
    flex-direction: row;
  }
}
.btn-save,
.btn-cancel {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-save {
  background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
  color: white;
}
.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 158, 71, 0.4);
}
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-cancel {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e0e0e0;
}
.btn-cancel:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-2px);
}

.success-message,
.error-message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid;
}
.success-message {
  background-color: #d4edda;
  color: #155724;
  border-color: #28a745;
}
.error-message {
  background-color: #fee;
  color: #c33;
  border-color: #c33;
}


.loading-message-small {
  text-align: center;
  padding: 1rem;
  color: #666;
}
.info-box {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #e7f3ff;
  border-left: 4px solid #0066cc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.info-box iconify-icon {
  color: #0066cc;
  flex-shrink: 0;
  font-size: 2rem;
}
.info-box p {
  margin: 0.25rem 0 0 0;
  color: #555;
  font-size: 0.9rem;
}
.subsection-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}
.info-box-neutral {
  background-color: #f8f9fa;
  border-left-color: #ccc;
}
.info-box-neutral iconify-icon {
  color: #666;
}
.meus-cursos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.curso-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fdfdfd;
}
.curso-card-historico {
  background-color: #f9f9f9;
  opacity: 0.8;
}
.curso-card-historico .curso-nome {
  color: #666;
}
@media (min-width: 768px) {
  .curso-card {
    flex-direction: row;
    align-items: center;
  }
}
.curso-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}
.curso-nome {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.curso-instrutores {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-instrutores {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.instrutores-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.instrutor-item-small {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 4px 10px 4px 4px;
  border-radius: 16px;
  font-size: 0.85rem;
}

.instrutor-avatar-tiny {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
}

.instrutor-nome-small {
  color: #495057;
  font-weight: 500;
}

.curso-instrutor {
  font-size: 0.9rem;
  color: #666;
}
.curso-status {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
}
.curso-status.inscrito {
  background-color: #d4edda;
  color: #155724;
}
.curso-status.fila-de-espera {
  background-color: #fff3cd;
  color: #856404;
}
.curso-status.concluido {
  background-color: #d1ecf1;
  color: #0c5460;
}
.curso-status.cancelado {
  background-color: #f8d7da;
  color: #721c24;
}
.btn-desinscrever {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #fee;
  color: #c33;
  border: 1px solid #c33;
}
.btn-desinscrever:hover:not(:disabled) {
  background-color: #c33;
  color: white;
}
.btn-desinscrever:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-avaliar {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: white;
}

.btn-avaliar:hover {
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
  transform: translateY(-2px);
}

.avaliacao-realizada {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avaliacao-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.avaliacao-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.stars-display {
  display: flex;
  gap: 0.25rem;
}

.star-filled {
  color: #ffc107;
}

.star-empty {
  color: #ddd;
}

.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.confirm-modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #133328;
  margin-top: 0;
  margin-bottom: 1rem;
}
.modal-text {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 2rem;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.btn-cancel-modal,
.btn-confirm-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-cancel-modal {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e0e0e0;
}
.btn-cancel-modal:hover:not(:disabled) {
  background: #e9ecef;
}
.btn-confirm-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}
.btn-confirm-delete:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}
.btn-confirm-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .confirm-modal-content,
.modal-fade-leave-active .confirm-modal-content {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from .confirm-modal-content,
.modal-fade-leave-to .confirm-modal-content {
  transform: scale(0.9) translateY(10px);
}

.modal-avaliacao {
  max-width: 550px;
}

.modal-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.avaliacao-form {
  margin-bottom: 2rem;
}

.avaliacao-form .form-group {
  margin-bottom: 1.5rem;
}

.avaliacao-form .form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #133328;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.stars-rating {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.star {
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star:hover {
  transform: scale(1.15);
}

.star-filled {
  color: #ffc107;
}

.rating-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.25rem;
}

.btn-confirm-submit {
  background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-confirm-submit:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
  transform: translateY(-2px);
}

.btn-confirm-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>