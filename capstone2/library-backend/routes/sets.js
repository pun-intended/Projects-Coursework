/** Routes for books. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureMaster, ensureAdmin } = require("../middleware/auth");
const BookSet = require("../models/bookSets");

const router = new express.Router();

/** GET /id => {sets: {set}...}
 * get all sets for a given school
 * 
 * Auth: Login
 */
router.get("/:id", ensureLoggedIn, async function (req, res, next){
    try{
        const allSets = await BookSet.getAll(req.params.id);
        req.return({ allSets });
    } catch(e) {
        return next(e);
    }
})

/** POST /new {schoolId} => {set}
 * Add book set
 * 
 * Auth: Admin
 */
router.post("/new", ensureAdmin, async function(req, res, next) {
    if(req.body.stage){
        try{
            const newSet = await BookSet.create(req.body.schoolId, req.body.stage);
            req.return({ newSet });
        } catch(e) {
            return next(e);
        }
    } else{
        try{
            const newSet = await BookSet.create(req.body.schoolId);
            req.return({ newSet });
        } catch(e) {
            return next(e);
        }
    }
    
});

/** PATCH /id {school_id} => {set}
 * Change the associated school for all 
 * 
 * Auth: Admin
 */
router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const patchSet = await BookSet.patch(req.body.schoolId, req.params.id);
        req.return({ patchSet });
    } catch(e) {
        return next(e);
    }
})

/** DELETE /id => {setId}
 * Delete a given set Id
 * 
 * Auth: Admin
 */
router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try{
        const deleteSet = await BookSet.delete(req.params.id);
        req.return({ deleteSet });
    } catch(e){
        return next(e)
    }
})




module.exports = router;