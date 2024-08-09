const Notification = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Create a new notification
exports.createNotification = catchAsync(async (req, res, next) => {
  const { user, message, read, createdAt } = req.body; // Assuming these fields come from the request body

  const notification = await Notification.create({
    user,
    message,
    read: read || false, // Default to false if not provided
    createdAt: createdAt || Date.now(), // Default to current date if not provided
  });

  res.status(201).json({
    status: "success",
    data: notification,
  });
});

// Get all notifications
exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find();

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: notifications,
  });
});

// Get a single notification by ID
exports.getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError(404, "Notification not found"));
  }

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

// Update a notification by ID
exports.updateNotification = catchAsync(async (req, res, next) => {
  const { user, message, read } = req.body;

  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { user, message, read },
    { new: true, runValidators: true }
  );

  if (!notification) {
    return next(new AppError(404, "Notification not found"));
  }

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

// Delete a notification by ID
exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return next(new AppError(404, "Notification not found"));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
