import { Router, type IRouter } from "express";
import healthRouter from "./health";
import equipmentRouter from "./equipment";
import bookingsRouter from "./bookings";
import testimonialsRouter from "./testimonials";
import operatorsRouter from "./operators";
import insightsRouter from "./insights";
import statsRouter from "./stats";
import authRouter from "./auth";
import adminRouter from "./admin";
import ownerRouter from "./owner";
import driverRouter from "./driver";
import driverBookingsRouter from "./driverBookings";

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
