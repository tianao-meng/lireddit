import { ApolloCache, gql } from '@apollo/client';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Post, PostSnippetFragment, PostsQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {

    // post: PostsQuery["posts"]["posts"][0]
    // post:Post
    post:PostSnippetFragment

}

const updateAfterVote = (value: number, postId:number, cache:ApolloCache<any> ) => {
    const data = cache.readFragment<{
        id: number,
        points: number,
        voteStatus: number | null,
    }>({

        id: "Post:" + postId,
        fragment: gql`
          fragment _ on Post{
            id
            points
            voteStatus
          }
        `,
        }
    )

    if(data){
        if(data.voteStatus === value){
          return;
        }
        const newPoints = (data.points) + ((!data.voteStatus ? 1 : 2) * (value as number));
        cache.writeFragment(
            {
                id: "Post:" + postId,
                fragment: gql`
                  fragment _ on Post {
                    points
                    voteStatus
                  }
                `,
                data: {  points: newPoints, voteStatus:value }
            }
        );
      }
    
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
        const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
        const [vote] = useVoteMutation();
        // console.log('post: ', post)
        return (
            <Flex direction='column' alignItems='center' justifyContent='center' mr={4}>
                <IconButton onClick={async () => {
                    if(post.voteStatus === 1){
                        return;
                    }
                    setLoadingState('updoot-loading');
                    await vote({variables:{postId: post.id, value:1}, update: (cache) => updateAfterVote(1,post.id,cache)});
                    setLoadingState('not-loading');
                }} aria-label='updoots post' icon={<ChevronUpIcon/>} colorScheme={post.voteStatus === 1 ? 'teal' : undefined} fontSize='24px' isLoading={loadingState === 'updoot-loading'}/>
                {post.points}
                <IconButton onClick={async () => {
                    if(post.voteStatus === -1){
                        return;
                    }
                    setLoadingState('downdoot-loading');
                    vote({variables:{postId:post.id, value:-1},update: (cache) => updateAfterVote(-1,post.id,cache)})
                    setLoadingState('not-loading'); 
                }} aria-label='downdoots post' icon={<ChevronDownIcon/>} colorScheme={post.voteStatus === -1 ? 'red' : undefined} fontSize='24px' isLoading={loadingState === 'downdoot-loading'}/>

            </Flex>
        );
}