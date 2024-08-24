import express from 'express';
import { authMiddleware, authorizeRole } from '../middleware/auth.middleware';
import { TransactionController } from '../controller/transaction.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction management
 */

/**
 * @swagger
 * /api/transactions/customer:
 *   get:
 *     summary: Get all transactions for a customer
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: List of transactions for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionForCustomerResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/customer', authMiddleware, authorizeRole('Customer'), TransactionController.getTransactionsForCustomers);

/**
 * @swagger
 * /api/transactions/seler:
 *   get:
 *     summary: Get all transactions for a seller
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: List of transactions for the seller
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionForSellerResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/seler', authMiddleware, authorizeRole('Seller'), TransactionController.getTransactionsForSeller);

/**
 * @swagger
 * /api/transactions/direct:
 *   post:
 *     summary: Checkout directly with a single product
 *     tags: [Transaction]
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
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found or insufficient stock
 *       500:
 *         description: Internal Server Error
 */
router.post('/direct', authMiddleware, authorizeRole('Customer'), TransactionController.checkoutDirect);

/**
 * @swagger
 * /api/transactions/bycart:
 *   post:
 *     summary: Checkout by cart items
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *             required:
 *               - itemIds
 *     responses:
 *       201:
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Items not found in cart
 *       500:
 *         description: Internal Server Error
 */
router.post('/bycart', authMiddleware, authorizeRole('Customer'), TransactionController.checkoutBycart);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction status
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the transaction
 *                 example: Success
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Transaction successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', authMiddleware, authorizeRole('Seller'), TransactionController.update);

export default router;
