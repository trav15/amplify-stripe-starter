/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      description
      price
      currency
      image
      product_data {
        metadata {
          productFileKey
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        price
        currency
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const fetchCheckoutURL = /* GraphQL */ `
  query FetchCheckoutURL($input: AWSJSON) {
    fetchCheckoutURL(input: $input)
  }
`;
