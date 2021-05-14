const path = require("path");
const Property = require("../models/Property");

//@desc  create a property for a user
//@route POST/api/v1/property/create
//@access Private

exports.createProperty = async (req, res, next) => {
  // const property = new Property({
  //   ...req.body,
  //   user: req.user.id,
  // });
  const property = await Property.create({ ...req.body, user: req.user.id });
  try {
    await property.save();
    res.status(201).json({ success: true, data: property });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  get all property for a logged in user
//@route POST/api/v1/property/create
//@access Private

exports.getUserProperty = async (req, res, next) => {
  try {
    const property = await Property.find({ user: req.user.id }).populate({
      path: "user",
      select: "name phoneNumber address",
    });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, error: "|No properties found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

//@desc  get all properties
//@route GET/api/v1/property/getAll
//@access Public

exports.getAllProperties = async (req, res, next) => {
  try {
    let query;
    //copy req.query
    const reqQuery = { ...req.query };

    //fileds to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //loop over remove field and delete them from req.query
    removeFields.forEach((param) => delete reqQuery[param]);

    //create string
    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = Property.find(JSON.parse(queryStr)).populate({
      path: "user",
      select: "name address phoneNumber",
    });
    //select fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      console.log(fields);
      query = query.select(fields);
    }
    //sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments();

    query = query.skip(startIndex).limit(limit);
    //executing query
    const property = await query;

    //pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res.status(200).json({ success: true, pagination, data: property });
    // res.status(200).json(res.advanceQuery);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

//@desc  delete a property by id
//@route Delete/api/v1/property/delete/:id
//@access Private

exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, error: "Property not found" });
    }
    //make sure user is the owner of property
    if (property.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized to delete the property" });
    }
    await property.remove();
    res.status(200).json({ success: true, data: property });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

//@desc  update property
//@route PUT/api/v1/property/update/:id
//@access Private

exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, error: "property not found" });
    }
    //make sure that user is the owner
    if (property.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "unauthorized to update the property" });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: property });
  } catch (e) {
    res.status(400).send(e);
  }
};

//@desc  upload photo of the property
//@route PUT/api/v1/property/updatePhoto/:id
//@access Private

exports.uploadPhotoProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "property not found" });
    }

    //make sure that the logged in user is the owner of the property
    if (property.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "unauthorized to update the photo" });
    }

    const file = req.files.photo;
    console.log(file);
    //make sure the photo is an image file
    if (!file.mimetype.startsWith("image")) {
      return res
        .status(400)
        .json({ success: false, error: "Please upload an image file" });
    }

    //upload size validation
    if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
      return res.status(400).json({
        success: false,
        error: `Please upload an image with size less than ${process.env.MAX_FILE_UPLOAD_SIZE} `,
      });
    }

    //create custom filename //it uses nodes path module to get the file extension

    file.name = `photo_${property._id}$ ${path.parse(file.name).ext}`;

    //now upload file with mv function options which is in files property
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, error: "Problem with file upload" });
      }
    });
    await Property.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  } catch (e) {
    res.status(400).send(e);
  }
};
