import { z } from "zod";

const updates = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
})

export const AdminValidationSchema = {
    updates
}
