import { Link } from "@chakra-ui/layout";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { PostsQuery, useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withApollo } from "../utils/withApollo";
const Index = () => {
  const {data, loading, fetchMore, variables} = usePostsQuery({
    variables: {limit: 10, cursor: null},
    notifyOnNetworkStatusChange:true,
  });
  // console.log('data; ',data);


  if(!loading && !data){
    return <div>you got no data for some reason</div>
  }
  return (
    <Layout>

      

        {(!data && loading) ? 
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
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                },
                // updateQuery: (previousValue, {fetchMoreResult}):PostsQuery => {
                //   if(!fetchMoreResult){
                //     return previousValue as PostsQuery;
                //   }
                //   return {
                //     __typename: 'Query', 
                //     posts:{
                //       __typename:'PaginatedPosts',
                //       hasMore: (fetchMoreResult  as PostsQuery).posts.hasMore,
                //       posts:[
                //         ...(previousValue as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts,
                //       ]
                //     }
                //   } 
                // }
              })

            }} isLoading={loading} m='auto' my={8}>Load more</Button>
          </Flex>
          : null
        }
    


    </Layout>
  )
}

export default withApollo({ssr: true})(Index)
