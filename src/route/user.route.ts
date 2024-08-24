import express from "express";
import { UserController } from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: handaru
 *               email:
 *                 type: string
 *                 format: email
 *                 example: handaru@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password
 *               phone_number:
 *                 type: string
 *                 example: 08123456789
 *               address:
 *                 type: string
 *                 example: Jl. Jendral Sudirman No. 1
 *               role:
 *                 type: string
 *                 enum: ['Seler', 'Customer']
 *                 example: Customer
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: User already exists
 *       422:
 *         description: Invalid image type
 *       500:
 *         description: Error uploading image
 */

router.post('/register', UserController.register);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Email or password is wrong
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Logout user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized access
 */
router.get('/logout', authMiddleware,UserController.logout);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: handaru@gmail.com
 *               name:
 *                 type: string
 *                 example: handaru
 *               address:
 *                 type: string
 *                 example: Jl. Jendral Sudirman No. 1
 *               phone_number:
 *                 type: string
 *                 example: 08123456789
 *               role:
 *                 type: string
 *                 enum: [Seller, Customer]
 *                 example: Seller
 *               avatar:
 *                 type: string
 *                 format: binary
 *             required:
 *               - email
 *               - name
 *               - role
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 *       422:
 *         description: Invalid image type
 *       500:
 *         description: Internal Server Error
 */

router.put('/', authMiddleware,UserController.update);

export default router;