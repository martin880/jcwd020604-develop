import React from 'react';
import { 
	Card, 
	CardBody, 
	Image, 
	Stack, 
	Heading, 
	Text,
	Flex,
} from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Product1 from "../../assets/product photos/TOPS/FR2LogoLongsleeveT-shirt2.jpg";
import Product2 from "../../assets/product photos/BOTTOMS/Pants1.jpg";
import Product3 from "../../assets/product photos/HEADWEARS/BermudaFurHat1.jpg";
import Product4 from "../../assets/product photos/TOPS/BouncingRabbitLongsleeveT-shirt1.jpg";
import Product5 from "../../assets/product photos/TOPS/Bouncing Rabbit Longsleeve T-shirt 2.jpg";
import Product6 from "../../assets/product photos/BOTTOMS/Contrast stitch Wide Pants 2.jpg";
import Product7 from "../../assets/product photos/HEADWEARS/Embroidery Icon Mesh Cap 1.jpg";
import Product8 from "../../assets/product photos/ACCESORIES/Festival Mask 3.jpg";

const products = [
  {
    id: 1,
    name: 'FR2 Logo Longsleeve T-shirt',
    price: 'Rp 1.056.000,00',
    image: Product1,
  },
  {
    id: 2,
    name: 'Pants',
    price: 'Rp 1.234.000,00',
    image: Product2,
  },
  {
    id: 3,
    name: 'Bermuda Fur Hat',
    price: 'Rp 890.000,00',
    image: Product3,
  },
  {
    id: 4,
    name: 'Bouncing Rabbit Longsleeve T-shirt',
    price: 'Rp 980.000,00',
    image: Product4,
  },
  {
    id: 5,
    name: 'Bouncing Rabbit Longsleeve T-shirt',
    price: 'Rp 1.056.726,00',
    image: Product5,
  },
  {
    id: 6,
    name: 'Contrast stitch Wide Pants 2',
    price: 'Rp 2.320.000,00',
    image: Product6,
  },
  {
    id: 7,
    name: 'Embroidery Icon Mesh Cap 1',
    price: 'Rp 705.000,00',
    image: Product7,
  },
  {
    id: 8,
    name: 'Festival Mask 3',
    price: 'Rp 235.000,00',
    image: Product8,
  },
  {
    id: 9,
    name: 'Contrast stitch Wide Pants 2',
    price: 'Rp 2.320.000,00',
    image: Product6,
  },
];

const ProductCard = ({ product }) => {
  return (
    <Card maxW='sm'>
      <CardBody>
        <Image src={product.image} alt={product.name} borderRadius='lg' />
        <Stack mt='6' spacing='2'>
          <Heading size='md'>{product.name}</Heading>
          <Text color='blue.600' fontSize='18px' fontWeight='bold'>
            {product.price}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

const GridProduct = () => {
const navigate = useNavigate();
const user = useSelector((state) => state.auth);
  return (
    <>
    {user.verified === true ? (
    <>
      <Flex justifyContent={'center'} 
        alignItems={'center'} 
        flexWrap={'wrap'} mt={4} 
        cursor={'pointer'} 
        onClick={() => navigate('/collection')}>
          {products.map((product) => (
            <Flex m={2}>
              <ProductCard key={product.id} product={product} />
            </Flex>
          ))}
      </Flex></>
      ) : (
      <>
       <Flex justifyContent={'center'} 
        alignItems={'center'} 
        flexWrap={'wrap'} mt={4} 
        cursor={'pointer'} 
        onClick={() => navigate('/not-found')}>
          {products.map((product) => (
            <Flex m={2}>
              <ProductCard key={product.id} product={product} />
            </Flex>
          ))}
      </Flex>
      </>)}
		
    </>
  );
};

export default GridProduct;
