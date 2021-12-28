import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number
    creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({id, creatorId}) => {
    const [,deletPost] = useDeletePostMutation();
    const [{data: meData}] = useMeQuery();
    if(meData?.me?.id !== creatorId){

        return null;
    }
    return (

        <Box>
            <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <IconButton as={Link} mr={4} aria-label='edit post' colorScheme='green' icon={<EditIcon />} />
            </NextLink>
            <IconButton aria-label='delete post' colorScheme='red' icon={<DeleteIcon />} onClick={() => {
            deletPost({id})
            }}/>
        </Box>
        

    );
}