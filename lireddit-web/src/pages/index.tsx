import React, { useState } from "react"
import { NavBar } from "../components/NavBar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Link } from "@chakra-ui/layout";
import NextLink from 'next/link'
import { Box, Button, Flex, Heading, Icon, IconButton, Stack, Text} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { UpdootSection } from "../components/UpdootSection";
const Index = () => {
  const [variables, setVariables] = useState({limit: 10, cursor: null as null | string});
  console.log('variables', variables)
  const [{data, fetching}] = usePostsQuery({variables});
  
  if(!fetching && !data){
    return <div>you got no data for some reason</div>
  }
  return (
    <Layout>

      

        {(!data && fetching) ? 
          <div>loading...</div>: 
          <Stack spacing={8}>
            {data!.posts.posts.map(p => 
              
                <div key={p.id}>
                  <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
                    <UpdootSection post={p}/>
                    <Box>
                      <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize='xl'>{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>posted by {p.creator.username}</Text>
                      <Text mt={4}>{p.textSnippet}</Text>
                    </Box>
                  </Flex>
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
