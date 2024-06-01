"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const HomeController_1 = require("./app/controllers/HomeController");
const AuthController_1 = require("./app/controllers/Manutencao e pecas/AuthController");
const MpController_1 = require("./app/controllers/Manutencao e pecas/MpController");
const LoggerController_1 = require("./app/controllers/Manutencao e pecas/LoggerController");
const NotificationController_1 = require("./app/controllers/Manutencao e pecas/NotificationController");
const MessageController_1 = require("./app/controllers/Manutencao e pecas/MessageController");
const router = (0, express_1.Router)();
exports.router = router;
//HOME
router.get("/", HomeController_1.homeController.home);
//#region MANUTENÇÃO E PEÇAS
//LOGGER
router.get("/mp/log", LoggerController_1.loggerController.get);
//MSG
router.post("/mp/messages", MessageController_1.messageController.create);
router.get("/mp/messages", MessageController_1.messageController.getBy);
//AUTH
router.post("/mp/auth/register", AuthController_1.authController.register);
router.post("/mp/auth/login", AuthController_1.authController.login);
router.get("/mp/user/:id", AuthController_1.authController.checkUserTokenLevel, AuthController_1.authController.userById);
router.get("/mp/users", AuthController_1.authController.checkAdminTokenLevel, AuthController_1.authController.getUsers);
//MP
router.get("/mp/forms/all", AuthController_1.authController.checkToken, MpController_1.mpController.all);
router.post("/mp/forms/create", AuthController_1.authController.checkToken, MpController_1.mpController.create);
router.get("/mp/forms/:id", AuthController_1.authController.checkToken, MpController_1.mpController.byId);
router.get("/mp/forms/module/:module", AuthController_1.authController.checkToken, MpController_1.mpController.byModule);
router.get("/mp/forms/warehouse/:warehouse", AuthController_1.authController.checkToken, MpController_1.mpController.byWarehouse);
router.get("/mp/search/item", AuthController_1.authController.checkAdminTokenLevel, MpController_1.mpController.allItems);
router.post("/mp/forms/:id", AuthController_1.authController.checkToken, MpController_1.mpController.update);
router.get("/mp/notification/:id", NotificationController_1.notificationController.byId);
router.get("/mp/notification/all", NotificationController_1.notificationController.all);
router.post("/mp/notification/:id", NotificationController_1.notificationController.updateNotification);
