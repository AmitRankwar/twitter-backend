import express from 'express'
import isAuthenticated from '../config/auth.js'
import {Login, Register ,   Logout, Bookmark,getMyProfile,getOtherUser,follow,unFollow } from '../controllers/userController.js'
const router = express.Router();
router.route("/register").post(Register)
router.route("/logout").get(Logout)
router.route("/login").post(Login)
router.route("/bookmark/:id").put(isAuthenticated,Bookmark)
router.route("/profile/:id").get(isAuthenticated,getMyProfile)
router.route("/otheruser/:id").get(isAuthenticated,getOtherUser)
router.route("/follow/:id").post(isAuthenticated,follow)
router.route("/unfollow/:id").post(isAuthenticated,unFollow)
export default router;