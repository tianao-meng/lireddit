import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { Layout } from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/layout';

export const Post = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
    const [{data, fetching}] = usePostQuery({
        pause: intId === -1,
        variables: {id: intId},
    })
    if(fetching){
        return(
            <Layout>loading ...</Layout>
        )
    }

    if(!data?.post){
        return (
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        )
    }
    return (
        <Layout>
            <Heading mb={4}>
                {data.post.title}
            </Heading>
            {data.post.text}
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr:true})(Post)