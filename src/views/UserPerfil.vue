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
                <!-- Coluna 1: Foto do Usuário -->
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
                            >
                                <iconify-icon icon="hugeicons:upload-02" width="20" height="20"></iconify-icon> Alterar Foto
                            </button>
                            <button 
                                v-if="userData.foto" 
                                class="btn-remove-photo"
                                @click="removeFoto"
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

                <!-- Coluna 2: Formulário -->
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
                                    placeholder="Seu nome completo"
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
                                    placeholder="seu@email.com"
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
                </div>
            </div>
        </div>
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
    mounted() {
        this.loadUserData();
    },
    methods: {
        loadUserData() {
            const user = localStorage.getItem('user');
            if (!user) {
                this.$router.push('/');
                return;
            }

            try {
                const userData = JSON.parse(user);
                console.log('Dados do usuário carregados:', userData); // Debug
                this.userData = { ...userData };
                this.formData.nome = userData.nome;
                this.formData.email = userData.email;
                this.formData.foto = userData.foto;
                this.formData.proficiencias = userData.proficiencias || [];
                this.loading = false;
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                this.error = 'Erro ao carregar dados do usuário';
                this.loading = false;
            }
        },

        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                // Validar tipo de arquivo
                if (!file.type.startsWith('image/')) {
                    this.errorMessage = 'Por favor, selecione um arquivo de imagem válido';
                    return;
                }

                // Validar tamanho (máximo 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.errorMessage = 'A imagem deve ter no máximo 5MB';
                    return;
                }

                this.selectedFile = file;
                
                // Preview da imagem
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.formData.foto = e.target.result;
                    this.userData.foto = e.target.result;
                };
                reader.readAsDataURL(file);

                this.errorMessage = '';
            }
        },

        removeFoto() {
            this.formData.foto = null;
            this.userData.foto = null;
            this.selectedFile = null;
            this.$refs.fileInput.value = '';
        },

        adicionarProficiencia() {
            if (this.novaProficiencia.trim()) {
                // Evitar duplicatas
                if (!this.formData.proficiencias.includes(this.novaProficiencia.trim())) {
                    this.formData.proficiencias.push(this.novaProficiencia.trim());
                    this.novaProficiencia = '';
                } else {
                    this.errorMessage = 'Esta proficiência já foi adicionada';
                    setTimeout(() => {
                        this.errorMessage = '';
                    }, 3000);
                }
            }
        },

        removerProficiencia(index) {
            this.formData.proficiencias.splice(index, 1);
        },

        async handleUpdate() {
            this.errorMessage = '';
            this.successMessage = '';
            this.saving = true;

            try {
                // Verificar se temos um ID válido
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

                // Atualizar localStorage
                const updatedUser = { ...this.userData, ...response.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Disparar evento para atualizar NavBar
                window.dispatchEvent(new Event('storage'));

                this.successMessage = 'Perfil atualizado com sucesso!';
                
                // Recarregar dados
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
            this.errorMessage = '';
            this.successMessage = '';
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

.loading-message,
.error-message {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: #dc3545;
}

/* Grid Layout Responsivo */
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

/* Seção de Foto */
.perfil-foto-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2rem;
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

.btn-change-photo:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 158, 71, 0.4);
}

.btn-remove-photo {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
}

.btn-remove-photo:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

/* Stats do Usuário */
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

/* Cards de Formulário */
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

/* Proficiências */
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

/* Info Box */
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
}

.info-box p {
    margin: 0.5rem 0 0 0;
    color: #666;
    font-size: 0.9rem;
}

/* Botões de Ação */
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

.success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #28a745;
}

.error-message {
    background-color: #fee;
    color: #c33;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #c33;
}
</style>
