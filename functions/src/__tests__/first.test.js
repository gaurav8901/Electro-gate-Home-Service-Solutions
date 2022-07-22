const firebase = require('@firebase/testing')
const admin = require('firebase-admin');
const { ref } = require('firebase-functions/v1/database');

const projectId = "electsolve-521ce"
process.env.GCLOUD_PROJECT = projectId
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
let app = admin.initializeApp({projectId})
let db = firebase.firestore(app)

beforeAll(async ()=>{
    await firebase.clearFirestoreData({projectId});
})


//When Document written to '/TestCollection/{DocumentId}' , trigger function to copy it to '/Copies/{DocumentId}
test("Expect to find a copy in 'Copies' Collection", async ()=>{
    const testDoc = {
        name: "Sameer",
        age: 21,
        city: 'Riyadh'
    }

    const Ref = db.collection('TestCollection').doc()
    await ref.set(testDoc)

    const copyId = ref.id

    const copyRef = db.collection('Copies').doc(copyId)

    const copyDoc = await copyRef.get()

    expert(copyDoc.data()).toStrictEqual(testDoc)
})