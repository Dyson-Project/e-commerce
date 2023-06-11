const SKU = {
  sellerSku: "",
  available: 1,
  quantity: 1,
  color: "Trắng",
  size: 38,
  height: 10,
  width: 10,
  length: 10,
  weight: 10,
  price: 90_000,
  images: [
    ""
  ]
}
const PRODUCT = {
  sellerId: 1,
  categoryId: 1,
  brandId: 1,
  productName: "",
  description: "",
  status: "active",
  skus: [
    SKU
  ]
}


const SCHEMA_MAP: Map<String, any> = new Map<String, any>();
SCHEMA_MAP.set(
  "products", PRODUCT)
SCHEMA_MAP.set(
  "skus", SKU
)
export {SKU, PRODUCT, SCHEMA_MAP}
