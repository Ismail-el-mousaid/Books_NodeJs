"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var book_model_1 = __importDefault(require("./book.model"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1["default"])();
//Middleware bodyParser pour parser le corps des requetes en JSON
app.use(body_parser_1["default"].json());
app.use((0, cors_1["default"])());
var uri = "mongodb://localhost:27017/BIBLIO";
//Create connexion avec mongoDb
mongoose_1["default"].connect(uri, function (error) {
    if (error)
        console.log(error);
    else
        console.log("Mongo DataBase connected successfuly");
});
app.get("/", function (req, resp) {
    resp.send("Hello Express");
});
//Get les books à partir de MongoDb
app.get("/books", function (req, resp) {
    book_model_1["default"].find(function (err, books) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
//Insert des données à partir de l'url
app.post("/books", function (req, resp) {
    var book = new book_model_1["default"](req.body);
    book.save(function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
//Consulter un document sachant son id
app.get("/books/:id", function (req, resp) {
    book_model_1["default"].findById(req.params.id, function (err, book) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
//Update
app.put("/books/:id", function (req, resp) {
    book_model_1["default"].findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book updated succeslully");
    });
});
//Delete
app["delete"]("/books/:id", function (req, resp) {
    book_model_1["default"].findByIdAndDelete(req.params.id, function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book deleted succeslully");
    });
});
//Pagination : http://localhost:8085/pbooks?page=1&size=5
app.get("/pbooks", function (req, resp) {
    var p = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 5);
    book_model_1["default"].paginate({}, { page: p, limit: size }, function (err, books) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
//Chercher un books sachant son titre : http://localhost:8085/books-search?kw=""&page=1&size=5
app.get("/books-search", function (req, resp) {
    var p = parseInt(req.query.page || 1);
    var size = parseInt(req.query.size || 5);
    var keyword = req.query.keyword || "";
    /* {$regex:".*(?i)"+kw+".*"}: titre contient kw et ne fais pas la différence entre maj et min (?i)   */
    book_model_1["default"].paginate({ title: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: size }, function (err, books) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.listen(8085, function () {
    console.log("Server started");
});
