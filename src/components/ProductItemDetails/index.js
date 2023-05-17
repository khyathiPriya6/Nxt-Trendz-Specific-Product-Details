import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    cartNumber: 1,
    apiStatus: apiStatusConstants.initial,
    productData: {},
    similarProductDetails: [],
  }

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.formatData(data)
      console.log(data)

      const updatedSimilarProductsData = data.similar_products.map(
        eachSimilarProduct => this.formatData(eachSimilarProduct),
      )
      console.log(updatedSimilarProductsData)
      this.setState({
        productData: updatedData,
        similarProductDetails: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  formatData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  onClickContinueShoppingBtn = () => {
    const {history} = this.props
    history.replace('/products')
  }

  decrementCartNumber = () => {
    const {cartNumber} = this.state
    if (cartNumber !== 1) {
      this.setState(prevState => ({cartNumber: prevState.cartNumber - 1}))
    }
  }

  incrementCartNumber = () => {
    this.setState(prevState => ({cartNumber: prevState.cartNumber + 1}))
  }

  renderProductDetails = () => {
    const {productData, cartNumber} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productData
    return (
      <div>
        <div className="product-container">
          <div className="product-img-container">
            <img className="product-img" src={imageUrl} alt="product" />
          </div>
          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="total-review">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="option-details">
              <span className="options">Availability: </span>
              {availability}
            </p>
            <p className="option-details">
              <span className="options">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="cart-number-container">
              <button
                className="icon-btn"
                type="submit"
                onClick={this.decrementCartNumber}
                data-testid="minus"
              >
                <BsDashSquare className="icon" />
              </button>

              <p className="cart-number">{cartNumber}</p>
              <button
                className="icon-btn"
                type="submit"
                onClick={this.incrementCartNumber}
                data-testid="plus"
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button type="submit" className="cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="error-container">
      <img
        className="error-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <button
        type="submit"
        className="continue-shopping-btn"
        onClick={this.onClickContinueShoppingBtn}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingPage = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingPage()
      default:
        return null
    }
  }

  render() {
    const {similarProductDetails} = this.state
    return (
      <div>
        <Header />
        <div className="product-view-container">
          {this.renderProductView()}
          <div>
            <p className="similar-product-heading">Similar Products</p>
            <ul className="similar-product-container">
              {similarProductDetails.map(eachSimilarProduct => (
                <SimilarProductItem
                  similarProductDetails={eachSimilarProduct}
                  id={eachSimilarProduct.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
