import { Typography } from '@mui/material';
import React from 'react';

import ProductImagesSwiper from '@/pages/productDetail/components/ProductImagesSwiper';
import { formatPrice } from '@/utils/formatter';

// 별도의 상태변경이나 비즈니스 로직없이 UI만 랜딩하는 컴포넌트를 테스트하는 것은 큰 의미 없음
const ProductInfoArea = ({ product }) => {
  return (
    <>
      <ProductImagesSwiper images={product.images} />
      <Typography
        variant="h5"
        noWrap
        textAlign="center"
        fontStyle="oblique"
        mt={4}
      >
        {product.title}
      </Typography>
      <Typography
        variant="h6"
        noWrap
        textAlign="center"
        fontStyle="oblique"
        mt={2}
      >
        {formatPrice(product.price)}
      </Typography>
    </>
  );
};

export default ProductInfoArea;
