import ProductModel from "../models/porduct.js";

//getting all products

export const getProductByCategory = async (req, res) => {
  try {
    console.log(req.params.category);
    const products = await ProductModel.find({
      proCategory: req.params.category,
    }).select(
      "proName proDescription proQuantity proPrice proCategory proBrand proImages createdAt isFeatured"
    );
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.proName,
      description: product.proDescription,
      quantity: product.proQuantity,
      price: product.proPrice,
      category: product.proCategory,
      brand: product.proBrand,
      images: product.proImages.map((img) => `${img}`),
      createdAt: product.createdAt,
      isFeatured: product.isFeatured,
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export default getProductByCategory;
