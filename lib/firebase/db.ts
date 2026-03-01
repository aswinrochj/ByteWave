import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    DocumentData,
    QueryConstraint,
    serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

// Generic function to get a document by ID
export const getDocument = async (coll: string, id: string) => {
    const docRef = doc(db, coll, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
};

// Generic function to get all documents from a collection
export const getCollection = async (coll: string, constraints: QueryConstraint[] = []) => {
    const q = query(collection(db, coll), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Generic function to add a document to a collection (auto-id)
export const addDocument = async (coll: string, data: DocumentData) => {
    try {
        const docRef = await addDoc(collection(db, coll), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document:", error);
        throw error;
    }
};

// Generic function to save a document (create or overwrite) with specific ID
export const saveDocument = async (coll: string, id: string, data: DocumentData) => {
    const docRef = doc(db, coll, id);
    try {
        await setDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Error saving document:", error);
        throw error;
    }
};

// Generic function to update an existing document
export const setDocument = async (coll: string, id: string, data: DocumentData) => {
    const docRef = doc(db, coll, id);
    try {
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

// Generic function to delete a document
export const removeDocument = async (coll: string, id: string) => {
    const docRef = doc(db, coll, id);
    try {
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};
