const PROPERTY = require("../models/property")
const cloudinary = require("cloudinary").v2
const fs = require("fs")

const handleAddProperty = async (req, res) => {
  const { title, location, price, propertyType, description, tags, propertyStatus, bathroom, bedroom, garage, squareFeet, name, phoneNumber, whatsappNumber } = req.body;

  try {
      // Validate input data (optional, depending on your requirements)

      const avatar = req.files.avatar.tempFilePath;
      const video = req.files.video.tempFilePath;
      const images = req.files.images;

      // Upload avatar to Cloudinary
      const avatarResult = await cloudinary.uploader.upload(avatar, {
          use_filename: true,
          folder: "betaHome"
      });
      fs.unlinkSync(avatar); // Delete temp file

      // Upload images to Cloudinary
      const imageUploadPromises = images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
              use_filename: true,
              folder: "betaHome"
          });
          fs.unlinkSync(image.tempFilePath); // Delete temp file
          return result.secure_url;
      });
      const uploadedImages = await Promise.all(imageUploadPromises);

      // Upload video to Cloudinary
      const videoResult = await cloudinary.uploader.upload(video, {
          resource_type: "video",
          folder: "betahomevideos"
      });
      fs.unlinkSync(video); // Delete temp file

      const media = {
          images: uploadedImages,
          video: videoResult.secure_url
      };

      const salesupport = {
          name,
          phoneNumber,
          whatsappNumber,
          avatar: avatarResult.secure_url
      };

      console.log(salesupport);

      const property = await PROPERTY.create({
          title,
          location,
          price,
          propertyType,
          description,
          tags,
          propertyStatus,
          bathroom,
          bedroom,
          garage,
          squareFeet,
          media,
          salesupport
      });

      res.status(201).json({ success: true, property });
  } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
  }
};



const handleGetAllProperty = async(req, res) => {
    const {location, type, bedroom, title, sort} = req.query

    const queryObject = {}
    let res = PROPERTY.find(queryObject)

    if (location) {
        queryObject.location = {$regex: location, $options: "i"}
    }

    if (type) {
        queryObject.propertyType = {$regex: type, $options: "i"}
    }

    if (bedroom) {
        queryObject.bedroom = {$eq: Number(bedroom)}
    }

    if (title) {
      queryObject.title = {$regex: title, $options: "i"}
    }

    if(sort){
      result - result.sort(`${sort}`) -("createdAt")
    } else{
      return res.sort("-createdAt")
    }
    
    try {
      result - result.find(queryObject)
        const property = await PROPERTY.find(queryObject).sort("-createdAt")
        res.status(200).json({success: true, NumOfProperty: property.length,property})
    } catch (error) {
        res.status(404).json(error)
    }
}

const handleGetRecentProperty = async(req, res) => {
    try {
        const recentProperties = await PROPERTY.find().sort("-createdAt").limit(3)
        res.status(200).json({success: true, properties: recentProperties})
    } catch (error) {
        res.status(404).json(error)
    }
}

const GetASingleProperty = async(req, res) => {
    const {propertyId} = req.params

    try {
        const property = await PROPERTY.findById({_id: propertyId})
        const propertyType = property.propertyType

        const similarProperty = await PROPERTY.find({propertyType}).limit(3)
        res.status(200).json({success: true, property,similarProperty})
    } catch (error) {
        res.status(404).json(error)
    }
}

const handleEditProperty = async (req, res) => {
    const { propertyId } = req.params;
    const {
      title,
      location,
      price,
      propertyType,
      description,
      tags,
      propertyStatus,
      bedroom,
      bathroom,
      garage,
      squareFeet,
      name,
      phoneNumber,
      whatsappNumber,
    } = req.body;
  
    try {
      // Check if the property exists
      const existingProperty = await PROPERTY.findById(propertyId);
      if (!existingProperty) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }
  
      // Update fields
      existingProperty.title = title ?? existingProperty.title;
      existingProperty.location = location ?? existingProperty.location;
      existingProperty.price = price ?? existingProperty.price;
      existingProperty.propertyType =
        propertyType ?? existingProperty.propertyType;
      existingProperty.description = description ?? existingProperty.description;
      existingProperty.tags = tags ?? existingProperty.tags;
      existingProperty.propertyStatus =
        propertyStatus ?? existingProperty.propertyStatus;
      existingProperty.bedroom = bedroom ?? existingProperty.bedroom;
      existingProperty.bathroom = bathroom ?? existingProperty.bathroom;
      existingProperty.garage = garage ?? existingProperty.garage;
      existingProperty.squareFeet = squareFeet ?? existingProperty.squareFeet;
  
      // Update sales support information
      existingProperty.salesupport = {
        name: name ?? existingProperty.salesupport.name,
        phoneNumber: phoneNumber ?? existingProperty.salesupport.phoneNumber,
        whatsappNumber:
          whatsappNumber ?? existingProperty.salesupport.whatsappNumber,
      };
  
      // Check if there is a new avatar
      if (req.files?.avatar) {
        const newAvatarResult = await cloudinary.uploader.upload(
          req.files.avatar.tempFilePath,
          {
            use_filename: true,
            folder: "betaHome",
          }
        );
        fs.unlinkSync(req.files.avatar.tempFilePath);
  
        // Update existing avatar with new one
        existingProperty.salesupport.avatar = newAvatarResult.secure_url;
      }
  
      // Check if there are new images
      if (req.files?.images && req.files.images.length > 0) {
        const newImagesUploadPromises = req.files.images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            use_filename: true,
            folder: "betaHome",
          });
          fs.unlinkSync(image.tempFilePath);
          return result.secure_url;
        });
        const newImages = await Promise.all(newImagesUploadPromises);
  
        // Update existing images with new ones
        existingProperty.media.images = [...newImages];
      }
  
      // Check if there is a new video
      if (req.files?.video) {
        const newVideoResult = await cloudinary.uploader.upload(
          req.files.video.tempFilePath,
          {
            resource_type: "video",
            folder: "betahomevideos",
          }
        );
        fs.unlinkSync(req.files.video.tempFilePath);
  
        // Update existing video with new one
        existingProperty.media.video = newVideoResult.secure_url;
      }
  
      // Save changes to the database
      await existingProperty.save();
  
      res.status(200).json({
        success: true,
        message: "Property updated successfully",
        property: existingProperty,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ success: false, message: "Failed to update property", error });
    }
  };

const handleDeleteProperty = async(req, res) => {
    const {propertyId} = req.params

    try {
        const property = await PROPERTY.findByIdAndDelete({_id: propertyId})
        res.status(200).json({success: true, property})
    } catch (error) {
        res.status(404).json(error)
    }
}

const handleFeaturedProperty = async(req, res) => {
  try {
    const housePro = await PROPERTY.find({propertyType: 'house'}).sort(-createdAt().limit())
    const landPro = await PROPERTY.find({propertyType: 'land'}).limit(3).sort(-createdAt().limit())

    const featuredProperties = [...housePro, ...landPro]
    res.status(200).json({ msg: "success", featuredProperties})
    
  } catch (error) {
    res.json(error)
  }
}

module.exports = {handleAddProperty, handleFeaturedProperty,handleGetAllProperty, handleGetRecentProperty, GetASingleProperty, handleEditProperty, handleDeleteProperty}