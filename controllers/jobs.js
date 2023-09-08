const CustomAPIError = require("../errors/custom-error");
const handleMongoError = require("../errors/mongo-error");
const Job = require("../models/Job");

/**
 * Getting the all Jobs related to user.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Json}.
 */
const allJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort({
    createdAt: -1,
  });
  res.status(200).json({ jobs, count: jobs.length });
};

/**
 * Getting the single Job related to user.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Json}.
 */
const getJob = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id: jobId },
    } = req;

    const job = await Job.find({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      next(new CustomAPIError("Job not found", 404));
    }
    res.status(200).json({ job });
  } catch (error) {
    next(handleMongoError(error));
  }
};

/**
 * creating a Job related to user.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Json}.
 */
const createJob = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({ job, msg: "Job created successfully" });
  } catch (error) {
    next(handleMongoError(error));
  }
};

/**
 * updating the Job related to user.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Json}.
 */
const updateJob = async (req, res, next) => {
  try {
    const {
      body: { title, company },
      user: { userId },
      params: { id: jobId },
    } = req;

    if (title == "" || company == "") {
      next(new CustomAPIError("Job title and company must be provided", 400));
    }

    const job = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true },
      { runValidation: true }
    );

    if (!job) {
      next(new CustomAPIError("Job not found", 404));
    }
    res.status(200).json({ job });
  } catch (error) {
    next(handleMongoError(error));
  }
};

/**
 * deleting the Job related to user.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Json}.
 */
const deleteJob = async (req, res, next) => {
  try {
    const {
      user: { userId },
      params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndRemove({
      _id: jobId,
      createdBy: userId,
    });
    if (!job) {
      next(new CustomAPIError("Job not found", 404));
    }
    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    next(handleMongoError(error));
  }
};

module.exports = { allJobs, getJob, createJob, updateJob, deleteJob };
