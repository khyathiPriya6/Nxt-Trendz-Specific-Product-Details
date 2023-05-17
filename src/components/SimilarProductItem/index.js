import './index.css'

const SimilarProductItem = props => {
  const {similarProductDetails} = props
  const {imageUrl, title, brand, rating, price} = similarProductDetails
  return (
    <li className="similar-product">
      <img
        className="similar-product-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container ">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
