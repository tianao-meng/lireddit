import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';


const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    useIsAuth();

    const [createPost] = useCreatePostMutation();
    return (
        <Layout variant="small">

            <Formik initialValues={{title: '', text: ''}} onSubmit={async (value ) => {
                        const {errors} = await createPost({variables:{
                            input : value
                        }, update: (cache) => {
                            cache.evict({fieldName: "posts:{}"})
                        }});
                        if(!errors) {

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

export default withApollo({ssr: false})(CreatePost);