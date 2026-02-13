import mongoose from "mongoose";
import Task from "../models/taskModel.js";

const objectId = (id) => new mongoose.Types.ObjectId(id);

export const getOverview = async (req, res) => {
  try {
    const userId = objectId(req.user);
    const now = new Date();
    const baseMatch = {
      $or: [{ owner: userId }, { sharedWith: userId }],
    };

    const [totals, statusBreakdown] = await Promise.all([
      Task.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
            },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
            },
            overdue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$status", "Completed"] },
                      { $lt: ["$dueDate", now] },
                      { $ne: ["$dueDate", null] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            owned: {
              $sum: { $cond: [{ $eq: ["$owner", userId] }, 1, 0] },
            },
            sharedWithMe: {
              $sum: { $cond: [{ $ne: ["$owner", userId] }, 1, 0] },
            },
          },
        },
      ]),
      Task.aggregate([
        { $match: baseMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const summary = totals[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0,
      owned: 0,
      sharedWithMe: 0,
    };

    const pie = ["Pending", "In Progress", "Completed"].map((status) => ({
      status,
      count: statusBreakdown.find((s) => s._id === status)?.count || 0,
    }));

    res.json({
      summary,
      statusBreakdown: pie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrends = async (req, res) => {
  try {
    const range = req.query.range === "monthly" ? "monthly" : "weekly";
    const userId = objectId(req.user);
    const now = new Date();
    const start = new Date(now);

    if (range === "monthly") {
      start.setMonth(start.getMonth() - 11);
      start.setDate(1);
    } else {
      start.setDate(start.getDate() - 7 * 7);
    }

    const tasks = await Task.aggregate([
      {
        $match: {
          $or: [{ owner: userId }, { sharedWith: userId }],
          dueDate: { $ne: null, $gte: start },
        },
      },
      {
        $project: {
          period:
            range === "monthly"
              ? { $dateToString: { format: "%Y-%m", date: "$dueDate" } }
              : { $dateToString: { format: "%Y-W%U", date: "$dueDate" } },
          completed: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          overdue: {
            $cond: [
              { $and: [{ $ne: ["$status", "Completed"] }, { $lt: ["$dueDate", now] }] },
              1,
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$period",
          completed: { $sum: "$completed" },
          overdue: { $sum: "$overdue" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      range,
      data: tasks.map((item) => ({
        period: item._id,
        completed: item.completed,
        overdue: item.overdue,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
