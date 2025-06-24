// src/graphql/schema/index.ts
import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Product {
    id: ID!
    nama: String!
    deskripsi: String
    gambar: String
  }

  type Pelatihan {
    id: ID!
    judul: String!
    deskripsi: String
  }

  type Query {
    searchProduk(keyword: String!): [Product]
    searchPelatihan(keyword: String!): [Pelatihan]
  }
`;
