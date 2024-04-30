"use strict"

const db = require('../db.js');
const Class = require("./class.js")
const {BadRequestError, NotFoundError } = require('../expressError.js');
const {
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
 } = require('./_testCommon.js');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("getAll", function(){
    test("works", async function(){
        let allClasses = await Class.getAll();
        expect(allClasses.length).toEqual(9);
        expect(allClasses[0]).toEqual({
            id: '1001',
            name: 'Class A',
            school_id: '101'
        })
    })
})

describe("create", function(){
    test("works", async function(){
        let newClass = await Class.create("test class", 103);
        let allClasses = await Class.getAll();
        expect(newClass).toEqual({
            name: "test class",
            school_id: "103"
        });
        expect(allClasses.length).toEqual(10);
        
    })
    test("fails with incomplete data", async function(){
        try{
            let newClass = await Class.create();
            fail();
        } catch(e){
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
})

describe("remove", function(){
    test("works", async function(){
        let removedClass = await Class.remove(109);
        let allClasses = await Class.getAll();
        expect(removedClass).toEqual({class_id: "109"});
        expect(allClasses.length).toEqual(8);
    })
    test("fails with incorrect ID", async function(){
        try{
            let removedClass = await Class.remove(0);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy;
        }
    })
})

describe("patch", function(){
    test("works", async function(){
        let newClassData = {
            school_id: "103",
            name: "new class"
        }
        let testUpdate = await Class.patch(109, newClassData);
        let patchedClass = await Class.get(109);

        expect(testUpdate).toEqual({
            class_id: "109",
            name: "new class",
            school_id: "103"
        })

        expect(patchedClass).toEqual({
            class_id: "109",
            name: "new class",
            school_id: "103"
        });
    });

    test("fails with incorrect ID", async function(){
        let newClassData = {
            school_id: "103",
            name: "new class"
        }
        try{
            let patchClass = await Class.patch(0, newClassData);
            fail();
        } catch(e) {
            expect(e instanceof NotFoundError).toBeTruthy;
        }
    });

    test("fails with incomplete data", async function(){
        try{
            let patchClass = await Class.patch(0);
            fail();
        } catch(e) {
            expect(e instanceof BadRequestError).toBeTruthy;
        }
    });
})

