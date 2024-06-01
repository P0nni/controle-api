import { Router } from "express";
import { homeController } from "./app/controllers/HomeController";
import { authController } from "./app/controllers/Manutencao e pecas/AuthController";
import { mpController } from "./app/controllers/Manutencao e pecas/MpController";
import { loggerController } from "./app/controllers/Manutencao e pecas/LoggerController";
import { notificationController } from "./app/controllers/Manutencao e pecas/NotificationController";
import { messageController } from "./app/controllers/Manutencao e pecas/MessageController";

const router: Router = Router();
//HOME
router.get("/", homeController.home);

//#region MANUTENÇÃO E PEÇAS
//LOGGER
router.get("/mp/log", loggerController.get);

//MSG
router.post("/mp/messages", messageController.create);
router.get("/mp/messages", messageController.getBy);

//AUTH
router.post("/mp/auth/register", authController.register);
router.post("/mp/auth/login", authController.login);
router.get(
  "/mp/user/:id",
  authController.checkUserTokenLevel,
  authController.userById
);
router.get(
  "/mp/users",
  authController.checkAdminTokenLevel,
  authController.getUsers
);

//MP
router.get("/mp/forms/all", authController.checkToken, mpController.all);
router.post("/mp/forms/create", authController.checkToken, mpController.create);
router.get("/mp/forms/:id", authController.checkToken, mpController.byId);
router.get(
  "/mp/forms/module/:module",
  authController.checkToken,
  mpController.byModule
);
router.get(
  "/mp/forms/warehouse/:warehouse",
  authController.checkToken,
  mpController.byWarehouse
);
router.get(
  "/mp/search/item",
  authController.checkAdminTokenLevel,
  mpController.allItems
);
router.post("/mp/forms/:id", authController.checkToken, mpController.update);

router.get("/mp/notification/:id", notificationController.byId);

router.get("/mp/notification/all", notificationController.all);
router.post("/mp/notification/:id", notificationController.updateNotification);

//#endregion

export { router };
