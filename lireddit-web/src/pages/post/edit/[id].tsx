import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';




export const EditPost = ({}) => {

    const router = useRouter();
    const intId = useGetIntId();
    const [{data, fetching}] = usePostQuery(
        {   pause: intId === -1,
            variables: {id: intId}
        }
    );
    const [, updatePost] = useUpdatePostMutation();

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
        <Layout variant="small">

            <Formik initialValues={{title: data.post.title, text: data.post.text}} onSubmit={async (value ) => {
                        await updatePost({
                            id:intId,
                            title: value.title,
                            text: value.text
                        })
                        router.back();
                    }}>
                    {
                            ({isSubmitting}) => (
                                    <Form>
                                            <InputField name= "title" label= "Title" placeholder= "title"/>
                                            <Box mt={4}>
                                                    <InputField name= "text" label= "Body" placeholder= "text..." textarea={true}/>
                                            </Box>
                                            <Button mt={4} type="submit" colorScheme="teal" isLoading={isSubmitting} color="white">Update Post</Button>

                                    </Form>
                            )
                    }
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(EditPost)