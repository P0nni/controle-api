"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeController = void 0;
class HomeController {
    home(req, res) {
        return res.status(200).json({
            status: 200,
            response: "Api Online",
        });
    }
}
exports.homeController = new HomeController();
