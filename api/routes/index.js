const express =require( "express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Sift Handover API - by Sina Nosrati")
})

router.use("/api/v1", require("./api-v1"))
router.get('*', function (req, res, next) {
    res.status(404).send("what???")
});

module.exports = router
