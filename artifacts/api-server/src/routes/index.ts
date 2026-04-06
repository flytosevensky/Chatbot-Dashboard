import { Router, type IRouter } from "express";
import conversationsRouter from "./conversations";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(conversationsRouter);

export default router;
