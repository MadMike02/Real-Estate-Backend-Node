const fs = require("fs");
const Expert = require("../models/expert");
const cloudinary = require("../middlewares/cloudinary");

/**
 * Request Handler to return the agents List based on their type
 * @return - returns agents list based on their type (Gold/ Platinum/Bronze).
 * @error - returns the error message as response.
 */
exports.agentType = async (req, res) => {
  const { type } = req.params;

  try {
    const agentsList = await Expert.find({ agentType: type })
      .select(
        "fullname contact email profileImg.imgUrl agentType companyName experience"
      )
      .sort({ _id: -1 })
      .limit(8)
      .exec();

    if (agentsList.length == 0)
      return res
        .status(404)
        .json({ message: "No agents currently!", status: "error" });

    res.status(200).json({ data: agentsList, status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request Handler to add an expert agent
 * @return - success message once the agent is added/created successfully.
 * @error - returns the error message as response.
 */
exports.addExpertAgent = async (req, res) => {
  const {
    fullname,
    email,
    contact,
    profileImg,
    experience,
    companyName,
    agentType,
  } = req.body;

  const newExpertAgent = new Expert({
    fullname,
    email,
    contact,
    profileImg,
    experience,
    agentType,
    companyName,
  });

  try {
    // const uploadProfile = async (path) =>
    //   await cloudinary.uploads(path, "ProfileImages");

    // if (req.file && req.file.path) {
    // const newPath = await uploadProfile(req.file.path);
    // const imageInfo = { imgUrl: newPath.url, publicId: newPath.id };
    // newExpertAgent.profileImg = imageInfo;
    // fs.unlinkSync(req.file.path);

    await newExpertAgent.save();
    res.status(201).json({
      message: "Expert User listed successfully!",
      status: "success",
    });
    // } else {
    //   res
    //     .status(405)
    //     .json({ message: "Error uploading profile image!", status: "error" });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request Handler to get all the expert agents list
 * @returns - the list of Expert Agents.
 * @error - returns the error message as response.
 */
exports.expertAgentList = async (req, res) => {
  try {
    const expertAgents = await Expert.find({ isActive: true })
      .select(
        "fullname contact email profileImg.imgUrl agentType companyName experience"
      )
      .sort({ _id: -1 })
      .limit(8)
      .exec();

    if (expertAgents.length === 0)
      return res
        .status(404)
        .json({ message: "No agents exists currently!", status: "error" });

    res.status(200).json({ data: expertAgents, status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request Handler to update an expert agent profile
 * @param {agentId} - gets expert agent ID from the URL.
 * @returns - new agent details once the profile has been updated.
 * @error - retuns the error message as the response.
 */
exports.updateExpertAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const getAgent = await Expert.findById({ _id: agentId }).exec();
    if (!getAgent)
      return res
        .status(404)
        .json({ message: "No expert agent found!", status: "error" });

    getAgent.fullname = req.body.fullname;
    getAgent.email = req.body.email;
    getAgent.contact = req.body.contact;
    getAgent.agentType = req.body.agentType;
    getAgent.companyName = req.body.companyName;
    getAgent.experience = req.body.experience;

    await getAgent.save();
    res.status(201).json({
      message: "Profile updated successfully!",
      data: getAgent,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};

/**
 * Request handler to Active/Deactive an expert agent Profile Status
 * @param {agentId} - gets the agent ID from the URL.
 * @param {status} - gets the Status from the URL Query String.
 * @returns - success message once the agent status has been changed successfully.
 * @error - returns the error message as the response.
 */
exports.changeAgentStatus = async (req, res) => {
  const { agentId } = req.params;
  const { status } = req.query;

  try {
    if (!status) {
      res.status(400).json({ message: "Invalid request!", status: "error" });
    }

    const agent = await Expert.findById({ _id: agentId }).exec();
    if (!agent)
      return res
        .status(404)
        .json({ message: "No expert agent found!", status: "error" });

    agent.isActive = status;
    await agent.save();

    res.status(201).json({
      message: "Status changed successfully",
      data: agent,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
