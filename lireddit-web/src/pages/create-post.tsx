import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react'
import NextLink from 'next/link';
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import {useRouter} from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';


const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [{data, fetching}]= useMeQuery();
    useEffect(() => {
        console.log('in effect: ', fetching, data);
        if(!fetching && !data?.me?.id){
            router.replace('/login')
        }
    }, [fetching, data, router])
    const [_, createPost] = useCreatePostMutation();
    return (
        <Layout variant="small">

            <Formik initialValues={{title: '', text: ''}} onSubmit={async (value ) => {
                        const {error} = await createPost({input : value});
                        if(!error) {

                            router.push('/');
                        }
                        

                    }}>
                    {
                            ({isSubmitting}) => (
                                    <Form>
                                            <InputField name= "title" label= "Title" placeholder= "title"/>
                                            <Box mt={4}>
                                                    <InputField name= "text" label= "Body" placeholder= "text..." textarea={true}/>
                                            </Box>
                                            <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Create Post</Button>

                                    </Form>
                            )
                    }
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost)