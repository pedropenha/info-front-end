<template>
    <div id="app">
        <Navbar />

        <main class="main-content">
            <router-view/>
        </main>

        <AppFooter />
    </div>
</template>

<script>
import Navbar from './components/NavBar.vue';
import AppFooter from './components/AppFooter.vue'; 

export default {
    name: 'App',
    components: {
        Navbar,
        AppFooter,
    },
};
</script>

<style lang="scss">
#app {
    font-family: Arial, sans-serif; /* Padrão do global.css */
    min-height: 100vh;
}

.main-content {
  padding-top: 55px; 
}
</style>