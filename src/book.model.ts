// @ts-ignore
import mongoose from "mongoose";
// @ts-ignore
import mongoosePaginate from "mongoose-paginate"; //Pour pagination

//Création du shéma (modèl)
let bookSchema = new mongoose.Schema({
    title:{type:String, required: true},
    author:{type:String, required: true},
    price:{type:Number, required: true},
    publishingDate:{type:Date, required: true, default: new Date()},
    available:{type:Boolean, required: true, default: true},
    quantity:{type:Number, required:true, default:0}
});

bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model("Book", bookSchema);
export default Book;
