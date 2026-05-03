import { Router, type IRouter } from "express";
import healthRouter from "./health";
import equipmentRouter from "./equipment";
import bookingsRouter from "./bookings";
import testimonialsRouter from "./testimonials";
import operatorsRouter from "./operators";
import insightsRouter from "./insights";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(equipmentRouter);
router.use(bookingsRouter);
router.use(testimonialsRouter);
router.use(operatorsRouter);
router.use(insightsRouter);
router.use(statsRouter);

export default router;
