<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h2 class="auth-title">Login</h2>
                    <p class="auth-subtitle">Acesse sua conta INFOESTE</p>
                </div>

                <form @submit.prevent="handleLogin" class="auth-form">
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
                        <label for="senha" class="form-label">Senha</label>
                        <input 
                            v-model="formData.senha"
                            type="password" 
                            id="senha"
                            class="form-input"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <button 
                        type="submit" 
                        class="btn-submit" 
                        :disabled="isLoading"
                    >
                        <span v-if="!isLoading">Entrar</span>
                        <span v-else>Entrando...</span>
                    </button>
                </form>

                <div class="auth-footer">
                    <p>Não tem uma conta? <router-link to="/cadastro" class="link-primary">Cadastre-se</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "UserLogin",
    data() {
        return {
            formData: {
                cpf: '',
                senha: ''
            },
            errorMessage: '',
            isLoading: false
        };
    },
    methods: {
        async handleLogin() {
            this.errorMessage = '';
            this.isLoading = true;

            try {
                const response = await axios.post('http://localhost:3000/api/auth/login', this.formData);
                
                
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                
                
                window.dispatchEvent(new Event('storage'));
                
                
                this.$router.push('/cursos');
                
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                
                if (error.response) {

                    this.errorMessage = error.response.data.message || 'Erro ao fazer login';
                } else if (error.request) {
                    
                    this.errorMessage = 'Erro ao conectar com o servidor';
                } else {
                    
                    this.errorMessage = 'Erro inesperado ao fazer login';
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
    max-width: 420px;
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
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
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
}
</style>