import { Router } from "express";
import { homeController } from "./app/controllers/HomeController";
import { authController } from "./app/controllers/AuthController";
import { mpController } from "./app/controllers/MpController";
import { loggerController } from "./app/controllers/LoggerController";

const router: Router = Router();

//HOME
router.get("/", homeController.home);

//LOGGER
router.get("/log", loggerController.get);

//AUTH
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get(
  "/user/:id",
  authController.checkUserTokenLevel,
  authController.userById
);
router.get(
  "/users",
  authController.checkAdminTokenLevel,
  authController.getUsers
);

//MP
router.get("/mp/all", authController.checkToken, mpController.all);
router.post("/mp/create", authController.checkToken, mpController.create);
router.get("/mp/:id", authController.checkToken, mpController.byId);
router.get(
  "/mp/module/:module",
  authController.checkToken,
  mpController.byModule
);
router.get(
  "/mp/warehouse/:warehouse",
  authController.checkToken,
  mpController.byWarehouse
);
router.get("/search/item",authController.checkAdminTokenLevel, mpController.allItems);
router.post("/mp/:id", authController.checkToken, mpController.update);

export { router };
