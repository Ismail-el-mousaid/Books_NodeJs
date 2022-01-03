"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var book_model_1 = __importDefault(require("../model/book.model"));
var app = (0, express_1["default"])();
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
app.get("/books", function (req, resp) {
    book_model_1["default"].find(function (err, books) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.listen(8085, function () {
    console.log("Server started");
});
