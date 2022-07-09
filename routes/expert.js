const router = require("express").Router();
// const upload = require("../middlewares/multer");
const {
  addExpertAgent,
  expertAgentList,
  changeAgentStatus,
  updateExpertAgent,
  agentType,
} = require("../controllers/expertAgent");

// Add an expert agent
router.post("/add-expert", /**upload.single("profileImg"),*/ addExpertAgent);

// Get all expert agents
router.get("/experts", expertAgentList);

// Update expert agent profile
router.put("/update/expert/:agentId", updateExpertAgent);

// Active/Deactive an expert agent
router.put("/expert/:agentId", changeAgentStatus);

// Fetch agents lists based on type
router.get('/expert/:type', agentType);

module.exports = router;
