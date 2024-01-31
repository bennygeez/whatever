const Attachment = require("../models/attachment");
const User = require("../models/user");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { SuccessHandler } = require("../utils/SuccessHandler");
const { uploadImages } = require("../middleware/uploadImage");
const {
  uploadCompressedVideosWithThumbnail
} = require("../middleware/compressVideo");

// upload photo
const uploadPhoto = async (req, res) => {
  // #swagger.tags = ['photo']
  try {
    console.log("🚀 ~ file: attachmentController.js:44 ~ videos ~ req?.files:", req?.files)
    if (req?.files?.length) {
      if (!req?.body?.type)
        return ErrorHandler("Please mention type in data", 500, req, res);

      if (req?.body?.type === "photo") {
        let images = req?.files?.map((value) => ({
          buffer: value?.buffer,
          name: `${Date.now()}-${value?.originalname}`
        }));

        await uploadImages(images, req, res, async (error, urls) => {
          if (urls) {
            let user = req?.user?._id;

            let insert = urls?.map((value) => ({
              createdBy: user,
              path: value,
              type: req?.body?.type
            }));
            let inserted = await Attachment.insertMany(insert);
            if (inserted)
              SuccessHandler(
                { message: "Attachment uploaded successfully" },
                200,
                res
              );
          }
        });
      } else {
        let videos = req?.files?.map((value) => ({
          buffer: value?.buffer,
          name: `${Date.now()}-${value?.originalname}`
        }));

        await uploadCompressedVideosWithThumbnail(
          videos,
          req,
          res,
          async (error, urls) => {
            if (urls?.videos) {
              let user = req?.user?._id;

              let insert = urls?.videos?.map((value, index) => ({
                createdBy: user,
                path: value,
                type: req?.body?.type,
                thumbnail: urls?.thumbnails[index]
              }));
              let inserted = await Attachment.insertMany(insert);
              if (inserted)
                SuccessHandler(
                  { message: "Attachment uploaded successfully" },
                  200,
                  res
                );
            } else {
              return ErrorHandler(
                "Some problem at getting urls.",
                500,
                req,
                res
              );
            }
          }
        );
      }
    } else ErrorHandler("Please attach attachment.", 500, req, res);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};

const addClick = async (req, res) => {
  // #swagger.tags = ['photo']

  try {
    const attachmentId = req.params.attachmentId;
    
    // Find the attachment by ID and increment the clicks count
    const updatedAttachment = await Attachment.findByIdAndUpdate(
      attachmentId,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!updatedAttachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    res.json(updatedAttachment);
  } catch (error) {
    console.error(error);
    ErrorHandler(error, 500, req, res);
  }
};

const getAttachmentsByUser = async (req, res) => {
  // #swagger.tags = ['photo']
  try {
    let attachments = await Attachment.find({
      createdBy: req?.query?.user || req?.user?._id
    });
    if (attachments) SuccessHandler(attachments, 200, res);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};

const getRecentAttachments = async (req, res) => {
  // #swagger.tags = ['photo']
  try {
    const attachments = await User.aggregate([
      {
        $lookup: {
          from: "attachments", // Name of the attachments collection
          localField: "_id",
          foreignField: "createdBy",
          as: "attachments"
        }
      },
      {
        $addFields: {
          attachments: {
            $slice: ["$attachments", -4] // Get the last 4 attachments
          }
        }
      },
      {
        $project: {
          // Include the fields you want to keep in the final result
          _id: 1,
          name: 1,
          email: 1,
          photo: 1,
          attachments: 1,
          city: 1,
          age: 1,
          gender: 1,
          hourly: 1,
          location:1,
          hostavailable:1,
          sexualOrientation:1,
          selectedEthnicities:1,
          bodyRating:1,
          assSize:1,
          bodyType:1,
          breastCupSize:1,
          languages:1,
          hairColor:1,
          feet:1,
          inches:1,
          weight:1,
          penisGirth:1,
          penisSize:1,
          bondage:1,
          useToys:1,
          threesome:1,
          roleplay:1,
          orgies:1,
          oral:1,
          footjob:1,
          events:1,
          doublePenetration:1

        } 
      }
    ]);

    if (attachments) SuccessHandler(attachments, 200, res);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};
const getNearByAttachments = async (req, res) => {
  // #swagger.tags = ['photo'];

  try {
    let { location } = req?.user,
      radiusInMiles = 100;
    let longitude = location?.coordinates?.[0],
      latitude = location?.coordinates?.[1];

    // Find users within the specified radius
    const nearbyUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radiusInMiles) * 1609.34 // convert to meters
        }
      }
    }).select("_id");

    // Find attachments created by nearby users
    const nearestAttachments = await Attachment.find({
      createdBy: { $in: nearbyUsers?.map((v) => v?._id) },
      createdAt: { $gte: new Date().setUTCHours(0, 0, 0, 0) } // Filter for attachments created today
    })
      .sort({ clicks: -1, createdAt: -1 })
      .populate("createdBy", "name email");

    res.json(nearestAttachments);
  } catch (error) {
    console.error(error);
    ErrorHandler(error, 500, req, res);
  }
};

// export default { uploadPhoto, getAttachmentsByUser };
module.exports = {
  uploadPhoto,
  getAttachmentsByUser,
  getRecentAttachments,
  getNearByAttachments,
  addClick
};
