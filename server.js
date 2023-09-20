//importando mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://riopretoduarte:3Hj1fV31VBS7Q5tM@cluster0.f8zeufb.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

//definição do schema do modelo
let userFormSchema = new mongoose.Schema({
    username: String,
    idade: Number,
    cidade: String,
    procurando: String,
    foto: String,
    tipoRelacionamento: String,
    querTerFilhos: String,
    orientacaoSexual: String,
    interesses: [String]
}, {collection: 'userForm'});

//criando o modelo com base no schema
let userForm = mongoose.model('userForm', userFormSchema);

//salvando dados no banco de dados MongoDB
function saveData(username, idade, cidade, procurando, foto, tipoRelacionamento, querTerFilhos, orientacaoSexual, interesses) {
    let novoUser = new userForm({
        username: username,
        idade: idade,
        cidade: cidade,
        procurando: procurando,
        foto: foto,
        tipoRelacionamento: tipoRelacionamento,
        querTerFilhos: querTerFilhos,
        orientacaoSexual: orientacaoSexual,
        interesses: interesses
    });

    novoUser.save((err, novoUser) => {
        if(err) return console.error(err);
        console.log(novoUser.username + " salvo no banco de dados.");
    });
}