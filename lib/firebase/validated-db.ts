import { z } from "zod";
import { addDocument, setDocument } from "./db";
import { DocumentData } from "firebase/firestore";

/**
 * Validates data against a Zod schema before adding it to Firestore.
 */
export const addValidatedDocument = async <T extends z.ZodTypeAny>(
    collectionName: string,
    data: z.infer<T>,
    schema: T
) => {
    try {
        const validatedData = schema.parse(data);
        return await addDocument(collectionName, validatedData as DocumentData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation failed:", error.errors);
            throw new Error(`Validation Error: ${error.errors.map(e => e.message).join(", ")}`);
        }
        throw error;
    }
};

/**
 * Validates data against a Zod schema before updating a document in Firestore.
 */
export const setValidatedDocument = async <T extends z.ZodTypeAny>(
    collectionName: string,
    id: string,
    data: Partial<z.infer<T>>,
    schema: T
) => {
    try {
        // For updates, we use partial validation if needed, or refine the schema
        // Here we assume the input is a partial update that should still match the schema's types
        const partialSchema = schema.partial();
        const validatedData = partialSchema.parse(data);
        return await setDocument(collectionName, id, validatedData as DocumentData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation failed:", error.errors);
            throw new Error(`Validation Error: ${error.errors.map(e => e.message).join(", ")}`);
        }
        throw error;
    }
};
