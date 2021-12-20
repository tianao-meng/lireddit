import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Post, PostSnippetFragment, PostsQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {

    // post: PostsQuery["posts"]["posts"][0]
    // post:Post
    post:PostSnippetFragment

}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
        const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
        const [_, vote] = useVoteMutation();
        // console.log('post: ', post)
        return (
            <Flex direction='column' alignItems='center' justifyContent='center' mr={4}>
                <IconButton onClick={async () => {
                    if(post.voteStatus === 1){
                        return;
                    }
                    setLoadingState('updoot-loading');
                    await vote({postId: post.id, value:1});
                    setLoadingState('not-loading');
                }} aria-label='updoots post' icon={<ChevronUpIcon/>} colorScheme={post.voteStatus === 1 ? 'teal' : undefined} fontSize='24px' isLoading={loadingState === 'updoot-loading'}/>
                {post.points}
                <IconButton onClick={async () => {
                    if(post.voteStatus === -1){
                        return;
                    }
                    setLoadingState('downdoot-loading');
                    vote({postId:post.id, value:-1})
                    setLoadingState('not-loading'); 
                }} aria-label='downdoots post' icon={<ChevronDownIcon/>} colorScheme={post.voteStatus === -1 ? 'red' : undefined} fontSize='24px' isLoading={loadingState === 'downdoot-loading'}/>

            </Flex>
        );
}