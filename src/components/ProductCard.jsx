import React from 'react';
import { Link } from 'react-router-dom';
import { getColorImage } from '../utils/colorHelper';
import { getVariedCoverImage } from '../utils/lureColorImages';
import { getLureShapeCategoryLabel } from '../utils/lureShapeCategories';
import { getColorDiscountPct, getProductMaxDiscountPct } from '../utils/blackNovember';

export default function ProductCard({ product }) {
  const mainImage = getVariedCoverImage(product) || product.images[0] || `${import.meta.env.BASE_URL}logo.png`;
  
  const productColors = product.options['Cor'] || [];
  const maxDiscount = getProductMaxDiscountPct(product.id, productColors);
  // A previa mostra so 8 cores: durante a Black November as cores com desconto vem primeiro.
  const previewColors = maxDiscount
    ? [...productColors.filter((c) => getColorDiscountPct(c, product.id) > 0), ...productColors.filter((c) => getColorDiscountPct(c, product.id) === 0)]
    : productColors;

  return (
    <article className="product-card">
      <div className="product-card-media">
        {maxDiscount > 0 && (
          <span className="bn-ribbon">{maxDiscount >= 30 ? `até -${maxDiscount}%` : `-${maxDiscount}%`}</span>
        )}
        <Link to={`/product/${product.id}`}>
          <img 
            src={mainImage} 
            alt={product.title} 
            loading="lazy"
            onError={(e) => { e.target.src = `${import.meta.env.BASE_URL}logo.png`; }}
          />
        </Link>
      </div>
      
      <div className="product-card-content">
        <span className="product-card-cat">{getLureShapeCategoryLabel(product) || 'Iscas'}</span>
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>
            {product.title}
          </Link>
        </h3>
        
        {/* Color swatches preview inside card */}
        {product.options['Cor'] && product.options['Cor'].length > 0 && (
          <div className="product-card-previews">
            <div className="card-swatches" aria-label="Cores disponíveis">
              {previewColors.slice(0, 8).map(color => {
                const imgUrl = getColorImage(color);
                const pct = getColorDiscountPct(color, product.id);
                return (
                  <span 
                    key={color} 
                    className={`card-swatch${pct ? ` bn-swatch-promo` : ``}`} 
                    style={imgUrl ? { backgroundImage: `url("${encodeURI(imgUrl)}")` } : { backgroundColor: '#e2e8f0' }} 
                    title={pct ? `${color} — ${pct}% OFF` : color}
                  />
                );
              })}
              {product.options['Cor'].length > 8 && (
                <span className="card-vars-count" style={{ fontSize: '10px', marginLeft: '4px' }}>
                  +{product.options['Cor'].length - 8}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="product-card-footer">
          <Link to={`/product/${product.id}`} className="product-card-action" style={{ width: '100%', textAlign: 'center' }}>
            Ver Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
