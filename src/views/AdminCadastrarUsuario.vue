<template>
    <div class="admin-page">
        <div class="admin-container">
            <h1 class="page-title">Cadastrar Novo Usuário</h1>

            <div class="form-card">
                <form @submit.prevent="handleCadastro">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome" class="form-label">
                                <iconify-icon icon="hugeicons:user" width="20" height="20"></iconify-icon> Nome Completo
                            </label>
                            <input 
                                v-model="formData.nome"
                                type="text" 
                                id="nome"
                                class="form-input"
                                placeholder="Nome completo do usuário"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="cpf" class="form-label">
                                <iconify-icon icon="hugeicons:identification" width="20" height="20"></iconify-icon> CPF
                            </label>
                            <input 
                                v-model="formData.cpf"
                                type="text" 
                                id="cpf"
                                class="form-input"
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="email" class="form-label">
                                <iconify-icon icon="hugeicons:mail-01" width="20" height="20"></iconify-icon> E-mail
                            </label>
                            <input 
                                v-model="formData.email"
                                type="email" 
                                id="email"
                                class="form-input"
                                placeholder="email@exemplo.com"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="senha" class="form-label">
                                <iconify-icon icon="hugeicons:lock" width="20" height="20"></iconify-icon> Senha
                            </label>
                            <input 
                                v-model="formData.senha"
                                type="password" 
                                id="senha"
                                class="form-input"
                                placeholder="Digite a senha"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="nivel" class="form-label">
                            <iconify-icon icon="hugeicons:user-circle" width="20" height="20"></iconify-icon> Nível de Acesso
                        </label>
                        <select 
                            v-model="formData.nivel"
                            id="nivel"
                            class="form-input"
                            required
                        >
                            <option value="">Selecione o nível</option>
                            <option value="user">Usuário Comum</option>
                            <option value="professor">Professor</option>
                            <option value="admin">Administrador</option>
                        </select>
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
                            <iconify-icon icon="hugeicons:user-add-01" width="20" height="20"></iconify-icon>
                            <span v-if="!isLoading">Cadastrar Usuário</span>
                            <span v-else>Cadastrando...</span>
                        </button>

                        <router-link to="/admin/usuarios" class="btn-cancel">
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
    name: "AdminCadastrarUsuario",
    data() {
        return {
            formData: {
                nome: '',
                cpf: '',
                email: '',
                senha: '',
                nivel: ''
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
            this.isLoading = true;

            try {
                await axios.post('http://localhost:3000/api/users/', this.formData);
                
                this.successMessage = 'Usuário cadastrado com sucesso!';
                
                // Limpar formulário
                this.formData = {
                    nome: '',
                    cpf: '',
                    email: '',
                    senha: '',
                    nivel: ''
                };

                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);

            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                
                if (error.response) {
                    this.errorMessage = error.response.data.message || 'Erro ao cadastrar usuário';
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
    max-width: 900px;
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

select.form-input {
    cursor: pointer;
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
