import React from "react";
import ImageComponent from "./component/ImageComponent";
//<ImageComponent src={'https://sapicture.blob.core.windows.net/sa-c-picture/'+product.article_number+'.jpg'}/>
/*<img
src={'https://sapicture.blob.core.windows.net/sa-c-picture/'+product.article_number+'.jpg'}
alt={product.article_description}
/>*/

const ProductItem = props => {
  const { product } = props;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
            <ImageComponent src={'https://sapicture.blob.core.windows.net/sa-c-picture/'+product.article_number+'.jpg'}
              alt={product.article_description}
            />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ textTransform: "capitalize" }}>
              {product.article_name}{" "}
            </b>
            { product.items_available > 0 ? (
              <small>{' ' + product.items_available + ' in stock'}</small>
            ) : (
              <small className="has-text-danger">Out Of Stock</small>
            )}
            <div className="is-clearfix">
              <button
                className="button is-small is-outlined is-primary   is-pulled-right"
                onClick={() => props.buyProduct(product.article_number)}
              >
                Buy Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
