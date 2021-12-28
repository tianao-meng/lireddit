import { Link } from "@chakra-ui/layout";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
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
                    <Box flex={1}>
                      <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                        <Link>
                          <Heading fontSize='xl'>{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>posted by {p.creator.username}</Text>
                      <Flex alignItems="center">
                        <Text flex={1} mt={4}>{p.textSnippet}</Text>
                        
                        <EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>
                      </Flex>
                      
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
