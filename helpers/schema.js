const { z } = require('zod');

const serviceSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        duration: z.coerce.number().positive("Duration must be a positive number"),
        price: z.coerce.number().positive("Price must be a positive number"),
        image: z.string().nonempty("Image is required"),   
});

module.exports = {serviceSchema};
