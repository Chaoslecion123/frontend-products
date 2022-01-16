import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import products from '../products';
import Loader from '../components/Loader'
import { gql, useQuery } from '@apollo/client'
import Message from '../components/Message'


const ALL_PRODUCTS = gql`
    query {
        getAllProducts {
            id,
            name,
            brand,
            category,
            description,
            price,
            image,
            countInStock
        }
    }
`


function HomeScreen({ history }) {
    const {data,error,loading} = useQuery(ALL_PRODUCTS)

    if (error) return <span style='color: red'>{error}</span>
    
    return (
        <div>
            <h1>Latest Products</h1>
             {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    :
                    <div> 
                        <Row>
                            {data.getAllProducts.map(product => (
                                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                   </div> 
            }  
        </div>
    )
}

export default HomeScreen