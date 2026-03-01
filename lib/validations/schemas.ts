import * as z from "zod";

export const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["student", "recruiter", "institution"]),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    skills: z.array(z.string()).optional(),
    avatar: z.string().url("Invalid avatar URL").optional(),
    institutionId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

export const jobSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    department: z.enum(["Engineering", "Product", "Design", "Marketing"]),
    description: z.string().min(20, "Description must be at least 20 characters"),
    location: z.string().min(2, "Location is required"),
    type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
    salary: z.string().optional(),
    status: z.enum(["Active", "Hold", "Closed"]).default("Active"),
    userId: z.string(), // The recruiter who posted it
});

export type JobFormData = z.infer<typeof jobSchema>;

export const applicationSchema = z.object({
    jobId: z.string(),
    studentId: z.string(),
    status: z.enum(["Pending", "Interviewing", "Offer", "Rejected"]).default("Pending"),
    resumeUrl: z.string().url("Invalid resume URL"),
    appliedAt: z.date().default(() => new Date()),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
