import foodModel from '../models/foodModel.js'
import fs from 'fs'

// add food
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }
       

        const image_name = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,   // ✅ fixed here
            category: req.body.category,
            image: image_name
        });

        await food.save();

        res.status(200).json({
            success: true,
            message: "Food Added",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error adding food"
        });
    }
};

//generate all foods
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.status(200).json({
            success: true,
            message: foods
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error"
        })
    }
}

//remove food 
const removeFood = async (req,res) => {
  try {
    const id = req.body.id

    const food = await foodModel.findById(id)
    if (!food) {
        return res.status(404).json({
            success : false,
            message : "Food not found"
        })
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        }
      });
    }
    await foodModel.findByIdAndDelete(id)
    res.status(200).json({
        success : true,
        message : "Food Removed succesfully"
    })
  } catch (error) {
       console.log(error)
        res.status(500).json({
            success: false,
            message: "Error"
        })
  }
}

export { addFood, listFood ,removeFood};
