import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
    title : {
        type : String,
        required : "notes must have title",
        trim : true, //Trim leading and trailing whitespace
    },
    content : {
        type : String,
        required : "notes must have content",
        trim : true,
    },
    userId : {
        type : String,
        ref : "User",
        required :true,
    },
});

const Notes = mongoose.model("Notes",notesSchema);
export default Notes;