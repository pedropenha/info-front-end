<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h2 class="auth-title">Cadastro</h2>
                    <p class="auth-subtitle">Crie sua conta INFOESTE</p>
                </div>

                <form @submit.prevent="handleCadastro" class="auth-form">
                    <div class="form-group">
                        <label for="nome" class="form-label">Nome Completo</label>
                        <input 
                            v-model="formData.nome"
                            type="text" 
                            id="nome"
                            class="form-input"
                            placeholder="Digite seu nome completo"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="cpf" class="form-label">CPF</label>
                        <input 
                            v-model="formData.cpf"
                            type="text" 
                            id="cpf"
                            class="form-input"
                            placeholder="000.000.000-00"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">E-mail</label>
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
                        <label for="senha" class="form-label">Senha</label>
                        <input 
                            v-model="formData.senha"
                            type="password" 
                            id="senha"
                            class="form-input"
                            placeholder="Digite uma senha"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="confirmarSenha" class="form-label">Confirmar Senha</label>
                        <input 
                            v-model="formData.confirmarSenha"
                            type="password" 
                            id="confirmarSenha"
                            class="form-input"
                            placeholder="Confirme sua senha"
                            required
                        />
                    </div>

                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <div v-if="successMessage" class="success-message">
                        {{ successMessage }}
                    </div>

                    <button 
                        type="submit" 
                        class="btn-submit" 
                        :disabled="isLoading"
                    >
                        <span v-if="!isLoading">Cadastrar</span>
                        <span v-else>Cadastrando...</span>
                    </button>
                </form>

                <div class="auth-footer">
                    <p>Já tem uma conta? <router-link to="/" class="link-primary">Faça login</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "UserCadastro",
    data() {
        return {
            formData: {
                nome: '',
                cpf: '',
                email: '',
                senha: '',
                confirmarSenha: ''
            },
            errorMessage: '',
            successMessage: '',
            isLoading: false
        };
    },
    methods: {
        validateForm() {
            if (!this.formData.nome || !this.formData.cpf || !this.formData.email || !this.formData.senha) {
                this.errorMessage = 'Todos os campos são obrigatórios';
                return false;
            }

            if (this.formData.senha !== this.formData.confirmarSenha) {
                this.errorMessage = 'As senhas não coincidem';
                return false;
            }

            if (this.formData.senha.length < 6) {
                this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
                return false;
            }

            // Validação básica de CPF (apenas formato)
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
            if (!cpfRegex.test(this.formData.cpf)) {
                this.errorMessage = 'CPF inválido';
                return false;
            }

            return true;
        },

        async handleCadastro() {
            this.errorMessage = '';
            this.successMessage = '';

            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;

            try {
                // Remove confirmarSenha do objeto antes de enviar
                const userData = {
                    nome: this.formData.nome,
                    cpf: this.formData.cpf,
                    email: this.formData.email,
                    senha: this.formData.senha
                };
                
                await axios.post('http://localhost:3000/api/auth/cadastro', userData);
                
                this.successMessage = 'Cadastro realizado com sucesso! Redirecionando...';
                
                // Limpar formulário
                this.formData = {
                    nome: '',
                    cpf: '',
                    email: '',
                    senha: '',
                    confirmarSenha: ''
                };

                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    this.$router.push('/');
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao fazer cadastro:', error);
                
                if (error.response) {
                    // Erro da API
                    this.errorMessage = error.response.data.message || 'Erro ao realizar cadastro';
                } else if (error.request) {
                    // Erro de rede
                    this.errorMessage = 'Erro ao conectar com o servidor';
                } else {
                    // Outro erro
                    this.errorMessage = 'Erro inesperado ao realizar cadastro';
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.auth-page {
    min-height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-container {
    width: 100%;
    max-width: 480px;
}

.auth-card {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}

.auth-title {
    font-size: 2rem;
    font-weight: 700;
    color: #133328;
    margin-bottom: 0.5rem;
}

.auth-subtitle {
    color: #666;
    font-size: 0.95rem;
}

.auth-form {
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
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

.error-message {
    background-color: #fee;
    color: #c33;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    border-left: 4px solid #c33;
}

.success-message {
    background-color: #efe;
    color: #2a7;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    border-left: 4px solid #2a7;
}

.btn-submit {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(135deg, #4e9e47 0%, #3d7d38 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(78, 158, 71, 0.4);
}

.btn-submit:active:not(:disabled) {
    transform: translateY(0);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.auth-footer {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
}

.auth-footer p {
    color: #666;
    font-size: 0.95rem;
}

.link-primary {
    color: #4e9e47;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.link-primary:hover {
    color: #3d7d38;
    text-decoration: underline;
}

@media (max-width: 480px) {
    .auth-card {
        padding: 2rem 1.5rem;
    }
    
    .auth-title {
        font-size: 1.75rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
}
</style>
