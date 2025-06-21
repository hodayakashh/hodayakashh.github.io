const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// ----- קונפיגורציה -----
// הצבע על קובץ מפתח השירות שהורדת מ-Firebase
const serviceAccount = require('./serviceAccountKey.json'); 
const BUCKET_NAME = 'hodayakashkash-85596.appspot.com'; //  שם ה-bucket שלך ב-Firebase Storage
const CSV_FILE_PATH = path.join(__dirname, 'materials_to_upload.csv');
// --------------------

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET_NAME,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

console.log('Firebase Admin SDK initialized successfully.');

async function findOrCreateDocument(collectionRef, queryField, queryValue, dataToCreate) {
    const snapshot = await collectionRef.where(queryField, '==', queryValue).limit(1).get();

    if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        console.log(`Found existing document in ${collectionRef.path}: ${docId}`);
        return docId;
    } else {
        const docRef = await collectionRef.add(dataToCreate);
        console.log(`Created new document in ${collectionRef.path}: ${docRef.id}`);
        return docRef.id;
    }
}

async function uploadFile(localPath, destinationPath) {
    console.log(`Uploading ${localPath} to gs://${BUCKET_NAME}/${destinationPath}...`);
    
    const [file] = await bucket.upload(localPath, {
        destination: destinationPath,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${destinationPath}`;
    
    console.log(`File uploaded successfully. Public URL: ${publicUrl}`);
    return publicUrl;
}


async function processRow(row) {
    try {
        console.log('\n-----------------------------------');
        console.log(`Processing row for material: ${row.materialTitle_en}`);

        // שלב 1: מצא או צור שנת לימוד
        const yearData = {
            name: { en: row.yearName_en, he: row.yearName_he },
            year_number: parseInt(row.yearNumber, 10),
        };
        const yearId = await findOrCreateDocument(db.collection('studyYears'), 'name.en', row.yearName_en, yearData);

        // שלב 2: מצא או צור קורס
        const courseCollectionRef = db.collection('studyYears').doc(yearId).collection('courses');
        const courseData = {
            name: { en: row.courseName_en, he: row.courseName_he },
            color: row.courseColor,
            semester: { en: row.courseSemester_en, he: row.courseSemester_he },
            year_id: yearId
        };
        const courseId = await findOrCreateDocument(courseCollectionRef, 'name.en', row.courseName_en, courseData);

        // שלב 3: העלה את הקובץ
        const localFilePath = path.join(__dirname, '..', row.localFilePath); // הנחה ש-localFilePath הוא יחסי לשורש הפרויקט
        if (!fs.existsSync(localFilePath)) {
            throw new Error(`File not found at: ${localFilePath}`);
        }
        const destinationPath = `materials/${path.basename(row.localFilePath)}`;
        const fileUrl = await uploadFile(localFilePath, destinationPath);

        // שלב 4: צור רשומת חומר לימוד
        const materialCollectionRef = courseCollectionRef.doc(courseId).collection('materials');
        const materialData = {
            title: { en: row.materialTitle_en, he: row.materialTitle_he },
            type: row.materialType,
            file_url: fileUrl,
            course_id: courseId,
            uploadDate: admin.firestore.FieldValue.serverTimestamp(),
            tags: [row.materialType, row.courseName_en]
        };
        
        const materialRef = await materialCollectionRef.add(materialData);
        console.log(`Successfully created material document: ${materialRef.id}`);

    } catch (error) {
        console.error(`Failed to process row for material "${row.materialTitle_en}":`, error);
    }
}

function runUpload() {
    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            console.log(`Finished reading CSV file. Found ${results.length} rows.`);
            for (const row of results) {
                await processRow(row);
            }
            console.log('\n-----------------------------------');
            console.log('Script finished.');
        });
}

runUpload(); 