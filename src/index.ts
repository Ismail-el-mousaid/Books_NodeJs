import express from "express";
import mongoose from "mongoose";
import Book from "./book.model";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
//Middleware bodyParser pour parser le corps des requetes en JSON
app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb://localhost:27017/BIBLIO";
//Create connexion avec mongoDb
mongoose.connect(uri,(error) => {
    if(error) console.log(error);
    else console.log("Mongo DataBase connected successfuly");
});

app.get("/",(req, resp) =>{
    resp.send("Hello Express");
});

//Get les books à partir de MongoDb
app.get("/books", (req, resp) => {
    Book.find((err, books)=>{   //books: est un param de résultat
        if(err) resp.status(500).send(err);
        else resp.send(books);
    });
});
//Insert des données à partir de l'url
app.post("/books", (req, resp) => {
    let book = new Book(req.body);
    book.save(err =>{
        if(err) resp.status(500).send(err);
        else resp.send(book);
    });
});
//Consulter un document sachant son id
app.get("/books/:id", (req, resp) => {
    Book.findById(req.params.id,(err, book)=>{   //books: est un param de résultat
        if(err) resp.status(500).send(err);
        else resp.send(book);
    });
});
//Update
app.put("/books/:id", (req, resp) => {
    Book.findByIdAndUpdate(req.params.id, req.body, (err) =>{
        if(err) resp.status(500).send(err);
        else resp.send("Book updated succeslully");
    })
});
//Delete
app.delete("/books/:id", (req, resp) => {
    Book.findByIdAndDelete(req.params.id, (err) =>{
        if(err) resp.status(500).send(err);
        else resp.send("Book deleted succeslully");
    })
});
//Pagination : http://localhost:8085/pbooks?page=1&size=5
app.get("/pbooks", (req, resp) => {
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    Book.paginate({}, {page:p, limit:size}, (err, books)=>{   //books: est un param de résultat
        if(err) resp.status(500).send(err);
        else resp.send(books);
    });
});
//Chercher un books sachant son titre : http://localhost:8085/books-search?kw=""&page=1&size=5
app.get("/books-search", (req, resp) => {
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    let keyword:string=req.query.keyword || "";
    /* {$regex:".*(?i)"+kw+".*"}: titre contient kw et ne fais pas la différence entre maj et min (?i)   */
    Book.paginate({title:{$regex:".*(?i)"+keyword+".*"}}, {page:p, limit:size}, (err, books)=>{   //books: est un param de résultat
        if(err) resp.status(500).send(err);
        else resp.send(books);
    });
});

app.listen(8085,()=>{
    console.log("Server started");
})
