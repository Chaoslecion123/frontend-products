import React, { useState, useEffect } from 'react'
import { Link ,useParams, useNavigate} from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { gql, useQuery } from '@apollo/client'


const DETAIL_PRODUCT = gql`
    query getDetailProduct($id: String!){
        getDetailProduct(id: $id){
            name,
            brand,
            category,
            description,
            price,
            image,
            countInStock,
        }
    }
`


function ProductScreen(props) {
    let {id} = useParams();
    let navegate = useNavigate();
    const {loading,error,data} = useQuery(DETAIL_PRODUCT,{
        variables: {id: String(id)}
    })
    const [qty, setQty] = useState(1)


    const addToCartHandler = () => {
        const cartItems = [{
            ...data.getDetailProduct,
            qty: qty
        }]
        localStorage.setItem("cartItems",JSON.stringify(cartItems))
        navegate(`/cart/${id}/qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log('submit')
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ?
                <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <Image src={data.getDetailProduct.image} alt={data.getDetailProduct.name} fluid />
                                </Col>

                                <Col md={3}>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <h3>{data.getDetailProduct.name}</h3>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <h3>{data.getDetailProduct.price}</h3>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <h3>{data.getDetailProduct.description}</h3>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>

                                <Col md={3}>
                                    <Card>
                                        <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>
                                                    <strong>{data.getDetailProduct.price}</strong>
                                                </Col>
                                            </Row>
                                            <h3>{data.getDetailProduct.name}</h3>
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                    {data.getDetailProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {data.getDetailProduct.countInStock > 0 && (
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Qty</Col>
                                                        <Col xs='auto' className='my-1'>
                                                            <Form.Control
                                                                as="select"
                                                                value={qty}
                                                                onChange={(e) => setQty(e.target.value)}
                                                            >
                                                                {

                                                                    [...Array(data.getDetailProduct.countInStock).keys()].map((x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    ))
                                                                }

                                                            </Form.Control>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )}

                                            <ListGroup.Item>
                                                <Button
                                                    onClick={addToCartHandler}
                                                    className='btn-block'
                                                    disabled={data.getDetailProduct.countInStock == 0}
                                                    type='button'>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                    </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )

            }


        </div >
    )
}

export default ProductScreen