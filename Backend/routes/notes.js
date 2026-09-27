const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../Models/Note');

//Route 1: Fetching all notes from database  "/api/notes/fetchallnotes".
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    // the user is found by using same **fetchuser** function(middleware)by it's user.id .
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Some Server Error Occured");
    }

})
/**.................................................................................................... */
//Route 2: ADDING NOTES  **notes** from req.body  "/api/notes/addnotes".
router.post('/addnotes', fetchuser, [
    body('tittle', 'Enter a valid tittle').isLength({ min: 3 }),
    body('description', 'Description should atleast 5 characters').isLength({ min: 5 })],
    async (req, res) => {
        console.log("BODY RECEIVED BY BACKEND:", req.body);
        const { tittle, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        try {
            const notes = new Note({
                tittle, description, tag, user: req.user.id
            });
            const savednotes = await notes.save();
            res.json(savednotes);
        }
        catch (err) {
            console.error(err.message);
            // console.log(err);
            res.status(500).send("Some Server Error Occured");
        }
    })

/**.................................................................................................... */
//Route 3: UPDATEing NOTES  **notes** from req.body  "/api/notes/updatenote".
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { tittle, description, tag } = req.body;
    //create the new (updated) Note.
    const update_note = {};
    if (tittle) { update_note.tittle = tittle };
    if (description) { update_note.description = description };
    if (tag) { update_note.tag = tag };

    try {
        // Find the note to be updated.
        let note = await Note.findById(req.params.id);
        // checking if given id is the same from server.
        if (!note) {
            return res.status(404).send("User not found!!");
        }
        //  checks if the note owner (user) is the same(by checking their ID's) .
        if (note.user.toString() != req.user.id) {
            return res.status(501).send("Unauthorized User!!!")
        }
        /* NOW this will update the note acc to syntax(findByIdAndUpdate(filter: Query<any, any>,
         update: UpdateQuery<TRawDocType>,options: QueryOptions<TRawDocType> &
         { includeResultMetadata: true; lean: true; }):)
        */
        note = await Note.findByIdAndUpdate(req.params.id, { $set: update_note }, { returnDocument: "after" });
        res.json({ note });
    }
    catch (err) {
        console.error(err.message);
        // console.log(err);
        res.status(500).send("Some Server Error Occured");
    }
})

/**.................................................................................................... */
//Route 4: Deleting NOTES  **notes** from req.body  "/api/notes/deletenote".
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
         // Find the note to be deleted.
    let note = await Note.findById(req.params.id);
    // checking if given id is the same from server.
    if (!note) {
        return res.status(404).send("Note has not found!!");
    }
    //  checks if the note owner (user) is the same(by checking their ID's) .
    if (note.user.toString() != req.user.id) {
        return res.status(501).send("Unauthorized User!!!")
    }
    /* NOW this will delete the note acc to syntax(findByIdAndDelete<ResultDoc = THydratedDocumentType>
    (id: ObjectId | any, options: QueryOptions<TRawDocType> & { lean: true; }):)
    */
    note = await Note.findByIdAndDelete(req.params.id, { returnDocument: "after" });
    res.json({ "sucess":"The note has been Deleted!",note : note});
    } 
    catch (err) {
        console.error(err.message);
        // console.log(err);
        res.status(500).send("Some Server Error Occured");
    }
})


module.exports = router;