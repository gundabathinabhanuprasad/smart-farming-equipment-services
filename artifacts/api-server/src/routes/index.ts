import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import equipmentRouter from "./equipment.js";
import bookingsRouter from "./bookings.js";
import testimonialsRouter from "./testimonials.js";
import operatorsRouter from "./operators.js";
import insightsRouter from "./insights.js";
import statsRouter from "./stats.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import ownerRouter from "./owner.js";
import driverRouter from "./driver.js";
import driverBookingsRouter from "./driverBookings.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(ownerRouter);
router.use(driverRouter);
router.use(driverBookingsRouter);
router.use(equipmentRouter);
router.use(bookingsRouter);
router.use(testimonialsRouter);
router.use(operatorsRouter);
router.use(insightsRouter);
router.use(statsRouter);

export default router;
