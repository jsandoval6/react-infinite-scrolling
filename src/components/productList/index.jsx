import { useState, useEffect, useRef } from "react";
import { Card, Row, Col } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  async function fetchProducts(page) {
    const limit = 10;
    const skip = (page - 1) * limit;

    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    const data = await response.json();
    setProducts((prevProds) => [...prevProds, ...data.products]);
    setHasMore(data.products.length > 0);
    setPage((prevPage) => prevPage + 1);
  }

  function onIntersection(entries) {
    console.log(entries);
    const [firstEntry] = entries;

    if (firstEntry.isIntersecting && hasMore) {
      fetchProducts(page);
    }
  }

  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [products]);

  return (
    <>
      {products.map((product) => (
        <Card
          key={product.id}
          style={{ width: "600px", margin: "0 auto" }}
          className='mb-2'
        >
          <Row>
            <Col md={4}>
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{ width: "100%", margin: "10px" }}
              />
            </Col>
            <Col md={8}>
              <Card.Body>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>$ {product.price}</Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}
      {hasMore && (
        <div ref={elementRef} style={{ textAlign: "center" }}>
          Loading...
        </div>
      )}
    </>
  );
};

export default ProductList;
