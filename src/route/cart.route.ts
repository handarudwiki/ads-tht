import express from 'express';
import { authMiddleware, authorizeRole } from '../middleware/auth.middleware';
import { CartController } from '../controller/cart.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get all carts for a user
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of carts for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authMiddleware, authorizeRole('Customer'), CartController.getAll);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get a cart by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart to retrieve
 *     responses:
 *       200:
 *         description: Cart found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       404:
 *         description: Cart not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', authMiddleware, authorizeRole('Customer'), CartController.getById);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Add a new product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               qty:
 *                 type: integer
 *             required:
 *               - product_id
 *               - qty
 *     responses:
 *       201:
 *         description: Product successfully added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/', authMiddleware, authorizeRole('Customer'), CartController.addToCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               qty:
 *                 type: integer
 *             required:
 *               - product_id
 *               - qty
 *     responses:
 *       200:
 *         description: Cart successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       404:
 *         description: Cart not found
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', authMiddleware, authorizeRole('Customer'), CartController.updateCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart to delete
 *     responses:
 *       204:
 *         description: Cart successfully deleted
 *       404:
 *         description: Cart not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', authMiddleware, authorizeRole('Customer'), CartController.deleteCart);

export default router;
