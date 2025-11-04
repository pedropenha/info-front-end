<template>
    <div class="admin-page">
        <div class="admin-container">
            <h1 class="page-title">Cadastrar Novo Curso</h1>

            <div class="form-card">
                <form @submit.prevent="handleCadastro">
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="nome" class="form-label">
                                <iconify-icon icon="hugeicons:book-02" width="20" height="20"></iconify-icon> Nome do Curso
                            </label>
                            <input 
                                v-model="formData.nome"
                                type="text" 
                                id="nome"
                                class="form-input"
                                placeholder="Nome do curso"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="descricao" class="form-label">
                            <iconify-icon icon="hugeicons:file-edit" width="20" height="20"></iconify-icon> Descrição
                        </label>
                        <textarea 
                            v-model="formData.descricao"
                            id="descricao"
                            class="form-input"
                            rows="3"
                            placeholder="Descrição do curso"
                            required
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="conteudo" class="form-label">
                            <iconify-icon icon="hugeicons:note" width="20" height="20"></iconify-icon> Conteúdo Programático
                        </label>
                        <textarea 
                            v-model="formData.conteudo"
                            id="conteudo"
                            class="form-input"
                            rows="4"
                            placeholder="Conteúdo que será abordado no curso"
                            required
                        ></textarea>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="instrutores" class="form-label">
                                <iconify-icon icon="hugeicons:teacher" width="20" height="20"></iconify-icon> Instrutores
                            </label>
                            <input 
                                v-model="formData.instrutores"
                                type="text" 
                                id="instrutores"
                                class="form-input"
                                placeholder="Nome dos instrutores"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="local" class="form-label">
                                <iconify-icon icon="hugeicons:location-01" width="20" height="20"></iconify-icon> Local
                            </label>
                            <input 
                                v-model="formData.local"
                                type="text" 
                                id="local"
                                class="form-input"
                                placeholder="Local do curso"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="publico" class="form-label">
                                <iconify-icon icon="hugeicons:users" width="20" height="20"></iconify-icon> Público Alvo
                            </label>
                            <input 
                                v-model="formData.publico"
                                type="text" 
                                id="publico"
                                class="form-input"
                                placeholder="Ex: Iniciantes, Intermediário"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="faixaEtaria" class="form-label">
                                <iconify-icon icon="hugeicons:user-group" width="20" height="20"></iconify-icon> Faixa Etária
                            </label>
                            <input 
                                v-model="formData.faixaEtaria"
                                type="text" 
                                id="faixaEtaria"
                                class="form-input"
                                placeholder="Ex: 18+"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="minimoVagas" class="form-label">
                                <iconify-icon icon="hugeicons:remove-circle" width="20" height="20"></iconify-icon> Mínimo de Vagas
                            </label>
                            <input 
                                v-model="formData.minimoVagas"
                                type="number" 
                                id="minimoVagas"
                                class="form-input"
                                placeholder="10"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="maximoVagas" class="form-label">
                                <iconify-icon icon="hugeicons:add-circle" width="20" height="20"></iconify-icon> Máximo de Vagas
                            </label>
                            <input 
                                v-model="formData.maximoVagas"
                                type="number" 
                                id="maximoVagas"
                                class="form-input"
                                placeholder="30"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="horario" class="form-label">
                                <iconify-icon icon="hugeicons:clock-01" width="20" height="20"></iconify-icon> Horário
                            </label>
                            <input 
                                v-model="formData.horario"
                                type="text" 
                                id="horario"
                                class="form-input"
                                placeholder="Ex: 19:00 - 22:00"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="preRequisitos" class="form-label">
                                <iconify-icon icon="hugeicons:check-list" width="20" height="20"></iconify-icon> Pré-requisitos
                            </label>
                            <input 
                                v-model="formData.preRequisitos"
                                type="text" 
                                id="preRequisitos"
                                class="form-input"
                                placeholder="Conhecimentos necessários"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="proeficiencias" class="form-label">
                            <iconify-icon icon="hugeicons:stars" width="20" height="20"></iconify-icon> Proficiências (opcional)
                        </label>
                        <input 
                            v-model="formData.proeficiencias"
                            type="text" 
                            id="proeficiencias"
                            class="form-input"
                            placeholder="Ex: JavaScript, React, Node.js"
                        />
                        <small class="form-hint">Separar por vírgula</small>
                    </div>

                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <div v-if="successMessage" class="success-message">
                        {{ successMessage }}
                    </div>

                    <div class="form-actions">
                        <button 
                            type="submit"
                            class="btn-save" 
                            :disabled="isLoading"
                        >
                            <iconify-icon icon="hugeicons:tick-02" width="20" height="20"></iconify-icon>
                            <span v-if="!isLoading">Cadastrar Curso</span>
                            <span v-else>Cadastrando...</span>
                        </button>

                        <router-link to="/admin/cursos" class="btn-cancel">
                            <iconify-icon icon="hugeicons:arrow-left-01" width="20" height="20"></iconify-icon> Voltar
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "AdminCadastrarCurso",
    data() {
        return {
            formData: {
                nome: '',
                descricao: '',
                conteudo: '',
                instrutores: '',
                preRequisitos: '',
                local: '',
                publico: '',
                minimoVagas: '',
                maximoVagas: '',
                horario: '',
                faixaEtaria: '',
                proeficiencias: ''
            },
            errorMessage: '',
            successMessage: '',
            isLoading: false
        };
    },
    mounted() {
        this.checkAdminAccess();
    },
    methods: {
        checkAdminAccess() {
            const user = localStorage.getItem('user');
            if (!user) {
                this.$router.push('/');
                return;
            }

            try {
                const userData = JSON.parse(user);
                if (userData.nivel !== 'admin') {
                    this.$router.push('/cursos');
                }
            } catch (error) {
                this.$router.push('/');
            }
        },

        async handleCadastro() {
            this.errorMessage = '';
            this.successMessage = '';

            // Validação de vagas
            const minVagas = parseInt(this.formData.minimoVagas);
            const maxVagas = parseInt(this.formData.maximoVagas);

            if (minVagas > maxVagas) {
                this.errorMessage = 'O mínimo de vagas não pode ser maior que o máximo';
                return;
            }

            this.isLoading = true;

            try {
                await axios.post('http://localhost:3000/api/cursos/', this.formData);
                
                this.successMessage = 'Curso cadastrado com sucesso!';
                
                // Limpar formulário
                this.formData = {
                    nome: '',
                    descricao: '',
                    conteudo: '',
                    instrutores: '',
                    preRequisitos: '',
                    local: '',
                    publico: '',
                    minimoVagas: '',
                    maximoVagas: '',
                    horario: '',
                    faixaEtaria: '',
                    proeficiencias: ''
                };

                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);

            } catch (error) {
                console.error('Erro ao cadastrar curso:', error);
                
                if (error.response) {
                    this.errorMessage = error.response.data.message || 'Erro ao cadastrar curso';
                } else {
                    this.errorMessage = 'Erro ao conectar com o servidor';
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.admin-page {
    min-height: calc(100vh - 120px);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 2rem 1rem;
}

.admin-container {
    max-width: 1000px;
    margin: 0 auto;
}

.page-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: #133328;
    margin-bottom: 2rem;
}

.form-card {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.form-row {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .form-row {
        grid-template-columns: repeat(2, 1fr);
    }
}

.form-group {
    margin-bottom: 1.5rem;
}

.full-width {
    grid-column: 1 / -1;
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
    font-family: inherit;
}

.form-input:focus {
    outline: none;
    border-color: #4e9e47;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(78, 158, 71, 0.1);
}

textarea.form-input {
    resize: vertical;
    min-height: 80px;
}

.form-hint {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.85rem;
    color: #666;
}

.error-message {
    background-color: #fee;
    color: #c33;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #c33;
}

.success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #28a745;
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
    text-decoration: none;
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

.btn-cancel:hover {
    background: #e9ecef;
    transform: translateY(-2px);
}
</style>
