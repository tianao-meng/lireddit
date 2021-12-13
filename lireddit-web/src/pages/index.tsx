import React, { useState } from "react"
import { NavBar } from "../components/NavBar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link } from "@chakra-ui/layout";
import NextLink from 'next/link'
import { Box, Button, Flex, Heading, Stack, Text} from "@chakra-ui/react";
const Index = () => {
  const [variables, setVariables] = useState({limit: 10, cursor: null as null | string});
  console.log('variables', variables)
  const [{data, fetching}] = usePostsQuery({variables});
  
  if(!fetching && !data){
    return <div>you got no data for some reason</div>
  }
  return (
    <Layout>
      <Flex align='center'>
        <Heading>
          Lireddit
        </Heading>

        <NextLink href='/create-post'>
          <Link ml='auto'>
            Create Post
          </Link>
        </NextLink>
      </Flex>
      

        {(!data && fetching) ? 
          <div>loading...</div>: 
          <Stack spacing={8}>
            {data!.posts.posts.map(p => 
              
                <div key={p.id}>
                  <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
                    <Heading fontSize='xl'>{p.title}</Heading>
                    <Text>posted by {p.creator.username}</Text>
                    <Text mt={4}>{p.textSnippet}</Text>
                  </Box>
                </div>
              
            )}
          </Stack> 
          
        }
        {
          data && data.posts.hasMore ?
          <Flex>

            <Button onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
              })
            }} isLoading={fetching} m='auto' my={8}>Load more</Button>
          </Flex>
          : null
        }
    


    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr:true})(Index)
