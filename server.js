const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path:'./.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(()=>console.log('Connection DB successfuly'));


const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`Server is runing on port ${port}...`);
})