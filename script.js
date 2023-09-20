const express = require('express');
const path = require('path');
const firebase = require('firebase');

const app = express();
const PORT = 5000;

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCYReocq-3ZcEVbwFR3OQS-R9OJ-EfL2Os",
    authDomain: "login---gerenciamento.firebaseapp.com",
    projectId: "login---gerenciamento",
    storageBucket: "login---gerenciamento.appspot.com",
    messagingSenderId: "710259137879",
    appId: "1:710259137879:web:537f5924faa6a8ef5ef212",
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para raiz   
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para raiz   
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para gerenciamento
app.get('/management', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gerenciamento.html'));
});

// Rota para logs
app.get('/logs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logs.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
