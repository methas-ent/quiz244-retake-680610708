import { Router, type Request, type Response } from "express";
// import Zod validators
import {
  zUserId,
  zItemId,
  zItemPostBody,
  zItemPutBody,
  zItemDeleteBody
} from "../libs/zodValidators.js";
// import types
import type { Item } from "../libs/types.ts";
// import database
import { items } from "../db/db.ts";
//import uuid
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from "../middlewares/authenMiddleware.ts";

const router = Router();

// GET /api/vXXX/items/:userId 
router.get("/:userId",authenticateToken ,(req: Request, res: Response) => {
   try {
    const userId = req.params.userId; //*

    const parseResult = zUserId.safeParse(userId);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.issues[0]?.message,
      });
    }

    const decodedUser = (req as any).user;
    if (!decodedUser || decodedUser.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }
    // หา index
    const basket = items.filter((item) => item.userId === userId);
    // const foundIndex = users.findIndex((u: User) => u.userId === users);
    if (basket.length === 0) {
      return res.status(404).json({
        success: false,
        message: `items for user ID ${userId} not found`,
      });
    }

    // พบแล้ว
    return res.status(200).json({
      success: true,
      data: basket,
    });
  } catch (err) {
    // ข้อผิดพลาด
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
  

});

// POST /api/vXXX/cart/:userId, body = {new item data}
// add a new Item for userId
router.post("/:userId",authenticateToken, (req: Request, res: Response) => {
  
  try {
    const { userId } = req.params;
    const decodedUser = (req as any).user;

    if (decodedUser.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    const body = {
      ...req.body,
      userId,
      itemId: uuidv4(),
    };

    const result = zItemPostBody.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }

    // Add product
    items.push(body);

    return res.status(201).json({
      success: true,
      message: "New item has been added successfully.",
      data: body,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }

});

// Delete /api/vXXX/items/:userId


export default router;