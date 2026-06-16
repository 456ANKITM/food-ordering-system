import Resturant from "../models/Resturant.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createResturant = async (req, res) => {
  try {
    const { name, description, phone, email, location } = req.body;
    if (!name || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone and location are required",
      });
    }

    const resturant = await Resturant.create({
      owner: req.user._id,
      name,
      description,
      phone,
      email,
      location,
    });

    return res.status(201).json({
      success: true,
      message: "Resturant Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateResturantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const resturant = await Resturant.findById(id);
    if (!resturant) {
      return res.status(404).json({
        success: false,
        message: "Resturant not found",
      });
    }
    const allowedFields = [
      "name",
      "phone",
      "email",
      "description",
      "isOpen",
      "deliveryAvailable",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        resturant[field] = req.body[field];
      }
    });

    if (req.body.location) {
      resturant.location = {
        ...resturant.location.toObject(),
        ...req.body.location,
      };
    }

    const updatedResturant = await resturant.save();

    return res.status(200).json({
      success: true,
      message: "Resturant Updated Successfully",
      resturnat: updatedResturant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateResturantImages = async (req, res) => {
  try {
    const { id } = req.params;
    const resturant = await Resturant.findById(id);
    if (!resturant) {
      return res.status(404).json({
        success: false,
        message: "Resturnat not found",
      });
    }
    // update logo if provided
    if (req.files?.logo?.length > 0) {
      const logoFile = req.files.logo[0];
      const uploadLogo = await uploadToCloudinary(
        logoFile.buffer,
        "resturants/logs",
      );
      resturant.logo = uploadLogo.secure_url;
    }

    // update cover image if provided
    if (req.files?.coverImage?.length > 0) {
      const coverFile = req.files.coverImage[0];
      const uploadCover = await uploadToCloudinary(
        coverFile.buffer,
        "resturants/covers",
      );
      resturant.coverImage = uploadCover.secure_url;
    }

    await resturant.save();
    return res.status(200).json({
      success: true,
      message: "Resturant imgaes updated successfully",
      logo: resturant.logo,
      coverImage: resturant.coverImage,
      resturant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
