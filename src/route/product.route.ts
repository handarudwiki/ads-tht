import express from 'express';
import { ProductController } from '../controller/product.controller';
import { authMiddleware, authorizeRole } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with optional search filters
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the product to search
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum price of the product
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum price of the product
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Description of the product to search
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPageableResponse'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', ProductController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 */
router.get('/:id', ProductController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Product Name
 *               price:
 *                 type: number
 *                 example: 2000
 *               description:
 *                 type: string
 *                 example: Description of the product
 *               stock:
 *                 type: integer
 *                 example: 100
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       422:
 *         description: Invalid image type
 *       500:
 *         description: Error uploading image
 */

router.post('/', authMiddleware, authorizeRole('Seller'), ProductController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Product]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Product Name
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 2000
 *               description:
 *                 type: string
 *                 example: Description of the product
 *               stock:
 *                 type: integer
 *                 example: 100
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Product not found
 *       422:
 *         description: Invalid image type
 *       500:
 *         description: Error uploading image
 */

router.put('/:id', authMiddleware, authorizeRole('Seller'), ProductController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *     responses:
 *       204:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authMiddleware, authorizeRole('Seller'), ProductController.delete);

export default router;
